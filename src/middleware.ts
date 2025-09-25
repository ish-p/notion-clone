import { auth } from "@/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
	// Try to check auth
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			return NextResponse.redirect(new URL("/login", request.url));
		}

		// If it's an API request, ensure email header aligns with token's email
		if (request.nextUrl.pathname.startsWith("/api")) {
			// First try search params
			let email = request.nextUrl.searchParams.get("email");
			if (!email) {
				// Try reqBody if not in search params
				const reqBody = await request.json();
				email = reqBody.email;
			}

			if (session.user.email !== email) {
				return NextResponse.json(
					{ error: "Provided email is not valid" },
					{ status: 403 }
				);
			}
		}
	} catch (error: unknown) {
		return NextResponse.json({ error: error }, { status: 401 });
	}
	return NextResponse.next();
}

export const config = {
	runtime: "nodejs",
	matcher: ["/api/document/:path*", "/doc/:path*"],
};
