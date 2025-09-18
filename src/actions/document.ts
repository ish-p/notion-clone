"use server";

import { auth } from "@/auth";
import axios from "axios";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

async function checkCredentials() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/login");
	}

	return session;
}

export default async function createNewDocument(): Promise<string | null> {
	const session = await checkCredentials();
	return await axios
		.post(
			"http://localhost:3000/api/document/create",
			{
				userId: session.user.id,
				email: session.user.email,
			},
			{
				headers: {
					cookie: (await headers()).get("cookie"),
				},
				withCredentials: true,
			}
		)
		.then(function (response) {
			return response.data.docId;
		})
		.catch(function (error) {
			console.log(error);
		})
		.finally(function () {
			return null;
		});
}
