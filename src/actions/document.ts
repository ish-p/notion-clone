"use server";

import { auth } from "@/auth";
import axios from "axios";
import { Date } from "mongoose";
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

export async function createNewDocument(): Promise<string | null> {
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
					// TODO: USE API KEYS INSTEAD OF PASSING COOKIE
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

interface detailedDocsFormat {
	_id: string;
	ownerId: string;
	ownerEmail: string;
	name: string;
	editors: string[];
	createdAt: Date;
	updatedAt: Date;
	content: object;
}

export async function getDocumentById(
	docId: string
): Promise<detailedDocsFormat | null> {
	const session = await checkCredentials();
	return await axios
		.post(
			`http://localhost:3000/api/document/get/${docId}`,
			{
				userId: session.user.id,
				email: session.user.email,
			},
			{
				headers: {
					// TODO: USE API KEYS INSTEAD OF PASSING COOKIE
					cookie: (await headers()).get("cookie"),
				},
				withCredentials: true,
			}
		)
		.then(function (response) {
			return response.data.docObj;
		})
		.catch(function (error) {
			console.log(error);
		})
		.finally(function () {
			return null;
		});
}

interface docsFormat {
	docId: string;
	role: "owner" | "editor" | "viewer" | null;
}

export async function getDocumentsByUserId(): Promise<docsFormat[]> {
	const session = await checkCredentials();
	const response = await axios
		.post(
			`http://localhost:3000/api/document/get/mine/${session.user.id}`,
			{
				userId: session.user.id,
				email: session.user.email,
			},
			{
				headers: {
					// TODO: USE API KEYS INSTEAD OF PASSING COOKIE
					cookie: (await headers()).get("cookie"),
				},
				withCredentials: true,
			}
		)
		.then(function (response) {
			return response.data.docs;
		})
		.catch(function (error) {
			console.log(error);
		})
		.finally(function () {
			return null;
		});
	if (!response || !response.docs) {
		return [];
	}
	// for each, get role
	const userDocs: docsFormat[] = [];
	response.docs.forEach(async (docId: string) => {
		const doc: detailedDocsFormat | null = await getDocumentById(docId);
		if (doc) {
			if (session.user.id in doc.editors) {
				userDocs.push({
					docId: doc._id,
					role: "editor",
				});
			} else if (doc.ownerId === session.user.id) {
				userDocs.push({
					docId: doc._id,
					role: "owner",
				});
			}
		}
	});
	return userDocs;
}
