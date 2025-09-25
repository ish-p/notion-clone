"use server";
import { connect } from "@/lib/mongodb";
import Document from "@/models/document";
import MetaUser from "@/models/metauser";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	connect();
	try {
		const reqBody = await request.json();
		const { email } = reqBody;

		const newDoc = new Document({
			ownerEmail: email,
		});
		const savedDoc = await newDoc.save();

		await MetaUser.findOneAndUpdate(
			{ email: email },
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
