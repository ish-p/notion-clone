"use server";
import { connect } from "@/lib/mongodb";
import Document from "@/models/document";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
	try {
		const reqBody = await request.json();
		const { userId, email } = reqBody;

		const newDoc = new Document({
			ownerId: userId,
			ownerEmail: email,
		});

		const savedDoc = await newDoc.save();

		return NextResponse.json({
			message: "Document created successfully",
			success: true,
			docId: savedDoc._id,
		});
	} catch (error: unknown) {
		return NextResponse.json({ error: error }, { status: 500 });
	}
}
