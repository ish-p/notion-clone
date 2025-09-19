"use server";
import { connect } from "@/lib/mongodb";
import Document from "@/models/document";
import MetaUser from "@/models/metauser";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	connect();
	try {
		const reqBody = await request.json();
		if ("docId" in reqBody) {
			const { userId, docId } = reqBody;

			const doc = await Document.findById(docId);
			if (doc) {
				if (userId === doc.ownerId || userId in doc.editors) {
					return NextResponse.json({
						message: "Document found successfully, sending back",
						success: true,
						doc,
					});
				}
			}
			return NextResponse.json({
				message: "Document not found",
				success: false,
			});
		} else {
			const { userId } = reqBody;

			const metauser = await MetaUser.findById(userId);

			if (metauser) {
				return NextResponse.json({
					message: "Found meta user, returning docs (string array)",
					success: true,
					docs: metauser.docs,
				});
			} else {
				return NextResponse.json({
					message: "Could not find requested user",
					success: false,
				});
			}
		}
	} catch (error: unknown) {
		return NextResponse.json({ error: error }, { status: 500 });
	}
}
