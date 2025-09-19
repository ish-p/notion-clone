"use server";

import { auth } from "@/auth";
import axios from "axios";
import { Date } from "mongoose";
import { headers } from "next/headers";

async function checkCredentials() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		return null;
	}

	return session;
}

export async function createNewDocument(): Promise<string | null> {
	const session = await checkCredentials();
	if (!session) {
		return null;
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
		.post(
			`http://localhost:3000/api/document/add`,
			{
				userId: session.user.id,
				docId,
				editorEmail,
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
		.post(
			`http://localhost:3000/api/document/delete`,
			{
				userId: session.user.id,
				docId,
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
		.post(
			`http://localhost:3000/api/document/get`,
			{
				userId: session.user.id,
				docId,
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
		.post(
			`http://localhost:3000/api/document/get`,
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
	// for each, get role
	const userDocs: docsFormat[] = [];
	for (const docId of response) {
		const doc: detailedDocsFormat | null = await getDocumentById(docId);
		if (doc) {
			if (session.user.id in doc.editors) {
				userDocs.push({
					docId: doc._id,
					name: doc.name,
					role: "editor",
				});
			} else if (doc.ownerId === session.user.id) {
				userDocs.push({
					docId: doc._id,
					name: doc.name,
					role: "owner",
				});
			}
		}
	}
	return userDocs;
}
