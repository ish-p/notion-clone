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

export async function addDocumentEditor(
	docId: string,
	editorEmail: string
): Promise<boolean> {
	const session = await checkCredentials();
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

interface docsFormat {
	docId: string;
	role: "owner" | "editor" | "viewer" | null;
}

export async function getDocumentsByUserId(): Promise<docsFormat[]> {
	const session = await checkCredentials();
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
