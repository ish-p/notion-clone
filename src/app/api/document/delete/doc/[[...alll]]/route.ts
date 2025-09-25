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

		const doc = await Document.findById(docId);
		if (doc) {
			if (email === doc.ownerEmail) {
				await Document.findByIdAndDelete(docId);
				await MetaUser.findOneAndUpdate(
					{ email: email },
					{
						$pop: { docs: docId },
					}
				);
				return NextResponse.json({
					message: "Document deleted successfully",
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
