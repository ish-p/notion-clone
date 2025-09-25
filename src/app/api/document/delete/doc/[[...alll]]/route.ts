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

		const doc = await Document.findById(docId);
		if (doc) {
			if (session.user.email === doc.ownerEmail) {
				// go through editor email's
				await Document.findByIdAndDelete(docId);
				await MetaUser.findOneAndUpdate(
					{ email: session.user.email },
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
