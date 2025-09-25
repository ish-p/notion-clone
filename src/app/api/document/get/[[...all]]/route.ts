"use server";
import { connect } from "@/lib/mongodb";
import Document from "@/models/document";
import MetaUser from "@/models/metauser";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	connect();
	try {
		const email = request.nextUrl.searchParams.get("email")!;
		const docId = request.nextUrl.searchParams.get("docId");
		if (!docId) {
			return await findAllUserDocs(email);
		} else {
			return await findDocById(docId, email);
		}
	} catch (error: unknown) {
		console.log(error);
		return NextResponse.json({ error: error }, { status: 500 });
	}
}

async function findAllUserDocs(email: string) {
	const metauser = await MetaUser.findOne({ email: email });
	if (metauser) {
		return NextResponse.json({
			message: "Found meta user, returning their docs",
			success: true,
			docs: metauser.docs,
		});
	} else {
		return NextResponse.json(
			{ error: "Could not find requested user" },
			{ status: 500 }
		);
	}
}

async function findDocById(docId: string, email: string) {
	const doc = await Document.findById(docId);
	if (doc) {
		if (email === doc.ownerEmail || email in doc.editors) {
			return NextResponse.json({
				message: "Document found successfully, sending back",
				success: true,
				doc,
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
}
