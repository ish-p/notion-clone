"use server";
import { connect } from "@/lib/mongodb";
import Document from "@/models/document";
import MetaUser from "@/models/metauser";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	connect();
	try {
		const userId = request.nextUrl.searchParams.get("userId")!;
		const docId = request.nextUrl.searchParams.get("docId");
		if (!docId) {
			return await findAllUserDocs(userId);
		} else {
			return await findDocById(docId, userId);
		}
	} catch (error: unknown) {
		console.log(error);
		return NextResponse.json({ error: error }, { status: 500 });
	}
}

async function findAllUserDocs(userId: string) {
	const metauser = await MetaUser.findById(userId);
	if (metauser) {
		return NextResponse.json({
			message: "Found meta user, returning their docs",
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

async function findDocById(docId: string, userId: string) {
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
}
