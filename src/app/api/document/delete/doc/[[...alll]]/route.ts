"use server";
import { auth } from "@/auth";
import { connect } from "@/lib/mongodb";
import Document from "@/models/document";
import MetaUser from "@/models/metauser";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
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
		const docId = request.nextUrl.searchParams.get("docId")!;

		const doc = await Document.findById(docId);
		if (doc) {
			if (session.user.email === doc.ownerEmail) {
				for (const editorEmail of doc.editors) {
					await MetaUser.findOneAndUpdate(
						{ email: editorEmail },
						{
							$pop: { docs: docId },
						}
					);
				}
				await MetaUser.findOneAndUpdate(
					{ email: session.user.email },
					{
						$pop: { docs: docId },
					}
				);
				await Document.findByIdAndDelete(docId);

				return NextResponse.json({
					message: "Document deleted successfully",
					success: true,
				});
			} else {
				return NextResponse.json(
					{ error: "Insufficient permission" },
					{ status: 403 }
				);
			}
		} else {
			return NextResponse.json(
				{ error: "Document not found" },
				{ status: 500 }
			);
		}
	} catch (error: unknown) {
		return NextResponse.json({ error: error }, { status: 500 });
	}
}
