"use server";
import { auth } from "@/auth";
import { connect } from "@/lib/mongodb";
import Document from "@/models/document";
import MetaUser from "@/models/metauser";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
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
		const docId = request.nextUrl.searchParams.get("docId");
		if (!docId) {
			return await findAllUserDocs(session.user.email);
		} else {
			return await findDocById(docId, session.user.email);
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
		if (email === doc.ownerEmail || doc.editors.includes(email)) {
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
