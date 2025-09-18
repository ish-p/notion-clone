"use client";

import { login, register } from "@/lib/auth/auth_utils";
import { useActionState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Spinner } from "../ui/shadcn-io/spinner";

export default function EmailPasswordForm({ type }: { type: string }) {
	const [error, formAction, pending] = useActionState(
		type === "login" ? login : register,
		undefined
	);
	return (
		<form action={formAction}>
			<div className="grid gap-6">
				<div className="grid gap-3">
					<Label htmlFor="email">Email</Label>
					<Input
						id="email"
						name="email"
						type="email"
						placeholder="email@example.com"
						defaultValue={error?.fields?.email?.toString() ?? ""}
						required
						disabled
					/>
				</div>
				<div className="grid gap-3">
					{type === "login" && (
						<div className="flex items-center">
							<Label htmlFor="password">Password</Label>
							<a
								href="#"
								className="ml-auto text-sm underline-offset-4 hover:underline"
							>
								Forgot your password?
							</a>
						</div>
					)}
					<Input
						id="password"
						name="password"
						type="password"
						placeholder="********"
						required
						disabled // Only accepting OAuth login for now
					/>
				</div>
				<Button type="submit" className="w-full">
					{pending ? (
						<Spinner key="circle" variant="circle" />
					) : type === "login" ? (
						<>Login</>
					) : (
						<>Register</>
					)}
				</Button>
				{error && (
					<p className="text-sm text-destructive">{error.message}</p>
				)}
			</div>
		</form>
	);
}
