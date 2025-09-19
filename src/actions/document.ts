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
		return null;
	}

	return session;
}

export async function createNewDocument(
	shouldRedirect: boolean
): Promise<string | null> {
	const session = await checkCredentials();
	if (!session) {
		if (shouldRedirect) {
			redirect("/login");
		} else {
			return null;
		}
	}
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

export async function addDocumentEditor(
	docId: string,
	editorEmail: string
): Promise<boolean> {
	const session = await checkCredentials();
	if (!session) {
		return false;
	}
	return await axios
		.put(
			`http://localhost:3000/api/document/add`,
			{
				userId: session.user.id,
				docId,
				editorEmail,
			},
			{
				headers: {
					// TODO: USE API KEYS INSTEAD OF PASSING COOKIE
					cookie: (await headers()).get("cookie"),
				},
				withCredentials: true,
			}
		)
		.then(function () {
			return true;
		})
		.catch(function (error) {
			console.log(error);
			return false;
		})
		.finally(function () {
			return false;
		});
}

export async function deleteDocument(docId: string): Promise<boolean> {
	const session = await checkCredentials();
	if (!session) {
		return false;
	}
	return await axios
		.delete(`http://localhost:3000/api/document/delete`, {
			params: {
				userId: session.user.id,
				docId,
			},
			headers: {
				// TODO: USE API KEYS INSTEAD OF PASSING COOKIE
				cookie: (await headers()).get("cookie"),
			},
			withCredentials: true,
		})
		.then(function () {
			return true;
		})
		.catch(function (error) {
			console.log(error);
			return false;
		})
		.finally(function () {
			return false;
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
	if (!session) {
		return null;
	}
	return await axios
		.get(`http://localhost:3000/api/document/get`, {
			params: {
				userId: session.user.id,
				docId,
			},
			headers: {
				// TODO: USE API KEYS INSTEAD OF PASSING COOKIE
				cookie: (await headers()).get("cookie"),
			},
			withCredentials: true,
		})
		.then(function (response) {
			return response.data.doc;
		})
		.catch(function (error) {
			console.log(error);
		})
		.finally(function () {
			return null;
		});
}

export interface docsFormat {
	docId: string;
	name: string;
	role: "owner" | "editor";
}

export async function getDocumentsByUserId(): Promise<docsFormat[]> {
	const session = await checkCredentials();
	if (!session) {
		return [];
	}
	const response = await axios
		.get(`http://localhost:3000/api/document/get`, {
			params: {
				userId: session.user.id,
			},
			headers: {
				// TODO: USE API KEYS INSTEAD OF PASSING COOKIE
				cookie: (await headers()).get("cookie"),
			},
			withCredentials: true,
		})
		.then(function (r) {
			return r.data.docs;
		})
		.catch(function (error) {
			console.log(error);
		})
		.finally(function () {
			return null;
		});

	if (!response) {
		return [];
	}

	// We have our string[] of docId's, now let's seperate by role
	const userDocs: docsFormat[] = [];
	for (const docId of response) {
		const doc: detailedDocsFormat | null = await getDocumentById(docId);
		if (doc) {
			let role: "owner" | "editor" | undefined = undefined;
			if (doc.ownerId === session.user.id) {
				role = "owner";
			} else if (session.user.id in doc.editors) {
				role = "editor";
			}
			// Only push if role is defined
			if (role) {
				userDocs.push({
					docId: doc._id,
					name: doc.name,
					role,
				});
			}
		}
	}
	return userDocs;
}
