"use server";
import { auth } from "@/auth";
import { connect } from "@/lib/mongodb";
import Document from "@/models/document";
import MetaUser from "@/models/metauser";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
	try {
		connect();

		const session = await auth.api.getSession({
			headers: request.headers,
		});

		if (!session) {
			return NextResponse.json(
				{ error: "You must be logged in to perform this action" },
				{ status: 401 }
			);
		}

		const reqBody = await request.json();
		const { docId, data } = reqBody;
		const { title: name, content, editors } = data;
		console.log(name, content, editors);

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

		if (editors) {
			const currentEditors = new Set(doc.editors);
			const sentEditors = new Set(editors);

			const newEditors = sentEditors.difference(currentEditors);
			const removedEditors = currentEditors.difference(sentEditors);

			// For each new editor, update metauser
			// For each removed editor, update metauser

			await Document.findByIdAndUpdate(docId, { editors: editors });
		}
		if (content) {
			// WIP
		}
		if (name) {
			await Document.findByIdAndUpdate(docId, { name: name });
			await MetaUser.updateOne(
				{ email: doc.ownerEmail, "docs.docId": doc._id },
				{ $set: { "docs.$.name": name } }
			);
			// update for each editor
		}

		return NextResponse.json({
			message: "Document updated successfully",
			success: true,
		});
	} catch (error: unknown) {
		return NextResponse.json({ error: error }, { status: 500 });
	}
}
