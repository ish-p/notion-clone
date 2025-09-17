import { auth } from "@/auth";
import { RegisterForm } from "@/components/auth/register_form";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (session) {
		redirect("/");
	}

	return (
		<div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
			<div className="w-full max-w-sm text-center">
				<RegisterForm />
			</div>
		</div>
	);
}
