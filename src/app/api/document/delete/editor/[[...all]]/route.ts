"use server";
import { auth } from "@/auth";
import { connect } from "@/lib/mongodb";
import Document from "@/models/document";
import MetaUser from "@/models/metauser";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
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

	try {
		const docId = request.nextUrl.searchParams.get("docId")!;
		const editorEmail = request.nextUrl.searchParams.get("editorEmail")!;

		const doc = await Document.findById(docId);
		if (doc) {
			if (session.user.email === doc.ownerEmail) {
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
			} else {
				return NextResponse.json(
					{ error: "Insufficient permission" },
					{ status: 401 }
				);
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
