"use server";
import { auth } from "@/auth";
import { APIError } from "better-auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import z from "zod";

const loginSchema = z.object({
	email: z.email(),
	password: z.string(),
});

export async function login(_: unknown, formData: FormData) {
	const { error, data } = loginSchema.safeParse({
		email: formData.get("email"),
		password: formData.get("password"),
	});

	if (error) {
		const tree = z.treeifyError(error);
		if (
			!tree.properties?.email?.errors &&
			tree.properties?.password?.errors
		) {
			return {
				message: error.issues[0].message,
				fields: { email: formData.get("email") },
			};
		} else {
			return {
				message: error.issues[0].message,
			};
		}
	}

	try {
		await auth.api.signInEmail({
			body: {
				email: data.email,
				password: data.password,
				callbackURL: "/",
			},
		});
	} catch (error) {
		if (error instanceof APIError) {
			return {
				message: error.message,
			};
		} else {
			console.log(error);
			return {
				message: "Something went wrong. Please try again.",
			};
		}
	}
	redirect("/home");
}

const registerSchema = z.object({
	email: z.email(),
	password: z
		.string()
		.min(8, "Password must be at least 8 characters")
		.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
		.regex(/[0-9]/, "Password must contain at least one digit"),
});

export async function register(_: unknown, formData: FormData) {
	const { error, data } = registerSchema.safeParse({
		email: formData.get("email"),
		password: formData.get("password"),
		callbackURL: "/",
	});
	if (error) {
		const tree = z.treeifyError(error);
		if (!tree.properties?.email?.errors) {
			return {
				message: error.issues[0].message,
				fields: { email: formData.get("email") },
			};
		} else {
			return {
				message: error.issues[0].message,
			};
		}
	}

	try {
		await auth.api.signUpEmail({
			body: {
				name: data.email.split("@")[0],
				email: data.email,
				password: data.password,
			},
		});
	} catch (error) {
		if (error instanceof APIError) {
			return {
				message: error.message,
			};
		} else {
			console.log(error);
			return {
				message: "Something went wrong. Please try again.",
			};
		}
	}
	redirect("/");
}

export async function logout() {
	try {
		await auth.api.signOut({
			headers: await headers(),
		});
	} catch (error) {
		console.log(error);
		return {
			message: "Something went wrong. Please try again.",
		};
	}
	redirect("/");
}

export async function signInOauth(_: unknown, formData: FormData) {
	const type = formData.get("type");
	try {
		const { url } = await auth.api.signInSocial({
			body: {
				provider: type,
				callbackURL: "/",
			},
		});
		if (url) {
			redirect(url);
		} else {
			return {
				message: "OAuth URL not found. Try again later.",
			};
		}
	} catch (error) {
		console.log(error);
		return {
			message: "Something went wrong. Please try again.",
		};
	}
}
