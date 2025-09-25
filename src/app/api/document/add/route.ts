"use server";
import { connect } from "@/lib/mongodb";
import Document from "@/models/document";
import MetaUser from "@/models/metauser";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
	connect();
	try {
		const reqBody = await request.json();
		const { userEmail, docId, editorEmail } = reqBody;

		const doc = await Document.findById(docId);
		if (doc && doc.ownerEmail === userEmail) {
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
		} else {
			return NextResponse.json(
				{ error: "Insufficient permission" },
				{ status: 403 }
			);
		}
	} catch (error: unknown) {
		return NextResponse.json({ error: error }, { status: 500 });
	}
}
