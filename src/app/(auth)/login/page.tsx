import { auth } from "@/auth";
import { LoginForm } from "@/components/login_form";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (session) {
		redirect("/");
	}

	const params = await searchParams;
	const error = params.error;

	return (
		<div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
			<div className="w-full max-w-sm">
				{error && <p className="text-red-500">Error: {error}. Please try again later.</p>}
				<LoginForm />
			</div>
		</div>
	);
}
