"use server";
import { connect } from "@/lib/mongodb";
import Document from "@/models/document";
import MetaUser from "@/models/metauser";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
	connect();
	try {
		const reqBody = await request.json();
		const { userId, docId, editorEmail } = reqBody;

		const doc = await Document.findById(docId);
		if (doc && doc.ownerId === userId) {
			const editor = await MetaUser.findOneAndUpdate(
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
				{ $push: { editors: editor._id } }
			);
			return NextResponse.json({
				message: "Editor added successfully",
				success: true,
			});
		}
		return NextResponse.json(
			{ error: "Document not found" },
			{ status: 500 }
		);
	} catch (error: unknown) {
		return NextResponse.json({ error: error }, { status: 500 });
	}
}
