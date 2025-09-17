import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

async function handleLogout() {
	"use server";
	await auth.api.signOut({
		headers: await headers(),
	});
	redirect("/");
}

export async function LogoutForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<div className="flex flex-col gap-3">
				<form action={handleLogout}>
					<Button type="submit" variant="outline" className="w-full">
						Logout
					</Button>
				</form>
			</div>
		</div>
	);
}
