"use server";
import { connect } from "@/lib/mongodb";
import Document from "@/models/document";
import MetaUser from "@/models/metauser";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
	connect();
	try {
		const userId = request.nextUrl.searchParams.get("userId")!;
		const docId = request.nextUrl.searchParams.get("docId")!;

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
		return NextResponse.json({ error: "Document not found" }, { status: 500 });
	} catch (error: unknown) {
		return NextResponse.json({ error: error }, { status: 500 });
	}
}
