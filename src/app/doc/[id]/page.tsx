import { auth } from "@/auth";
import DocumentPage from "@/components/DocumentPage";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Doc() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/");
	}

	return <DocumentPage />;
}
