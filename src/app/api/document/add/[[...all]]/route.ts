"use server";
import { auth } from "@/auth";
import { connect } from "@/lib/mongodb";
import Document from "@/models/document";
import MetaUser from "@/models/metauser";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
	try {
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

		const reqBody = await request.json();
		const { docId, editorEmail } = reqBody;

		const doc = await Document.findById(docId);

		if (!doc) {
			return NextResponse.json(
				{ error: "Document with that ID does not exist" },
				{ status: 403 }
			);
		}
		if (doc.ownerEmail !== session.user.email) {
			return NextResponse.json(
				{ error: "Insufficient permission" },
				{ status: 403 }
			);
		}

		await MetaUser.findOneAndUpdate(
			{ email: editorEmail },
			{
				$push: {
					docs: {
						docId: doc._id,
						name: doc.name,
						role: "editor",
					},
				},
			},
			{ upsert: true }
		);
		await Document.updateOne(
			{ _id: docId },
			{ $push: { editors: editorEmail } }
		);

		return NextResponse.json({
			message: "Editor added successfully",
			success: true,
		});
	} catch (error: unknown) {
		return NextResponse.json({ error: error }, { status: 500 });
	}
}
