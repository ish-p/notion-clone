"use server";
import { connect } from "@/lib/mongodb";
import Document from "@/models/document";
import MetaUser from "@/models/metauser";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	connect();
	try {
		const reqBody = await request.json();
		const { userId, docId, editorEmail } = reqBody;

		const doc = await Document.findById(docId);
		if (doc && doc.ownerId === userId) {
			const editor = await MetaUser.findOneAndUpdate(
				{ email: editorEmail },
				{ $push: { docs: doc._id } },
				{ upsert: true }
			);
			doc.editors.$push(editor._id);
			await doc.save();
			return NextResponse.json({
				message: "Editor added successfully",
				success: true,
			});
		}
		return NextResponse.json({
			message: "Document not found",
			success: false,
		});
	} catch (error: unknown) {
		return NextResponse.json({ error: error }, { status: 500 });
	}
}
