"use server";
import { auth } from "@/auth";
import { connect } from "@/lib/mongodb";
import Document from "@/models/document";
import MetaUser from "@/models/metauser";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
	connect();

	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		return NextResponse.json(
			{ error: "You must be logged in to perform this action" },
			{ status: 401 }
		);
	}

	try {
		const newDoc = new Document({
			ownerEmail: session.user.email,
		});
		const savedDoc = await newDoc.save();

		await MetaUser.findOneAndUpdate(
			{ email: session.user.email },
			{
				$push: {
					docs: {
						docId: savedDoc._id,
						name: savedDoc.name,
						role: "owner",
					},
				},
			},
			{ upsert: true }
		);

		return NextResponse.json({
			message: "Document created successfully",
			success: true,
			doc: savedDoc,
		});
	} catch (error: unknown) {
		return NextResponse.json({ error: error }, { status: 500 });
	}
}
