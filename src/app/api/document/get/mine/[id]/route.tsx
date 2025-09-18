"use server";
import { connect } from "@/lib/mongodb";
import MetaUser from "@/models/metauser";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	connect();
	try {
		const reqBody = await request.json();
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
	} catch (error: unknown) {
		return NextResponse.json({ error: error }, { status: 500 });
	}
}
