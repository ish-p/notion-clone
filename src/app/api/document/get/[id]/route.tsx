"use server";
import { connect } from "@/lib/mongodb";
import Document from "@/models/document";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	connect();
	try {
		const reqBody = await request.json();
		const { userId } = reqBody;
		const docId = (await params).id;

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
	} catch (error: unknown) {
		return NextResponse.json({ error: error }, { status: 500 });
	}
}
