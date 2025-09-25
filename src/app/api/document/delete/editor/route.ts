"use server";
import { connect } from "@/lib/mongodb";
import Document from "@/models/document";
import MetaUser from "@/models/metauser";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
	connect();
	try {
		const email = request.nextUrl.searchParams.get("email")!;
		const docId = request.nextUrl.searchParams.get("docId")!;
		const editorEmail = request.nextUrl.searchParams.get("editorEmail")!;

		const doc = await Document.findById(docId);
		if (doc) {
			if (email === doc.ownerEmail) {
				await Document.findByIdAndUpdate(docId, {
					$pop: { editors: editorEmail },
				});
				await MetaUser.findOneAndUpdate(
					{ email: editorEmail },
					{
						$pop: { docs: docId },
					}
				);
				return NextResponse.json({
					message: "Editor removed successfully",
					success: true,
				});
			}
		}
		return NextResponse.json(
			{ error: "Document not found" },
			{ status: 500 }
		);
	} catch (error: unknown) {
		return NextResponse.json({ error: error }, { status: 500 });
	}
}
