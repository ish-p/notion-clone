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

export async function createNewDocument(): Promise<detailedDocsFormat | null> {
	const session = await checkCredentials();
	if (!session) {
		redirect("/login");
	}
	return await axios
		.post(
			"http://localhost:3000/api/document/create",
			{},
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
			return null;
		});
}

export async function updateDocumentMeta(
	id: string,
	data: { title?: string; content?: string; editors?: string[] }
) {
	const session = await checkCredentials();
	if (!session) {
		return false;
	}
	return await axios
		.put(
			`http://localhost:3000/api/document/update`,
			{
				docId: id,
				data,
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
		});
}

export interface detailedDocsFormat {
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
			return null;
		});
}

export interface docsFormat {
	docId: string;
	name: string;
	role: "owner" | "editor";
}

export async function getDocumentsByUser(): Promise<docsFormat[]> {
	const session = await checkCredentials();
	if (!session) {
		return [];
	}
	const res = await axios
		.get(`http://localhost:3000/api/document/get`, {
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
			if (error.status != 500) {
				console.log(error);
			}
			return [];
		});
	return res;
}
