import { auth } from "@/auth";
import { LoginForm } from "@/components/auth/login_form";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Login() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (session) {
		redirect("/");
	}

	return <LoginForm />;
}
