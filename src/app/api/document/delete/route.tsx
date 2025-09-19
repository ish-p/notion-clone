"use server";
import { connect } from "@/lib/mongodb";
import Document from "@/models/document";
import MetaUser from "@/models/metauser";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	connect();
	try {
		const reqBody = await request.json();
		const { userId, docId } = reqBody;

		const doc = await Document.findById(docId);
		if (doc) {
			if (userId === doc.ownerId) {
				await Document.findByIdAndDelete(docId);
				await MetaUser.findByIdAndUpdate(userId, {
					$pop: { docs: docId },
				});
				return NextResponse.json({
					message: "Document deleted successfully",
					success: true,
					doc,
				});
			}
		}
		return NextResponse.json({
			message: "Document not found",
			success: false,
		});
	} catch (error: unknown) {
		return NextResponse.json({ error: error }, { status: 500 });
	}
}
