"use client";
import { logout } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useActionState } from "react";
import { Spinner } from "../ui/shadcn-io/spinner";

export function LogoutForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const [error, formAction, pending] = useActionState(logout, undefined);
	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<form action={formAction}>
				<Button
					type="submit"
					variant="link"
					className="w-full p-0 m-0 text-red-500"
				>
					{pending ? (
						<Spinner key="circle" variant="circle" />
					) : (
						<>Logout</>
					)}
				</Button>
				{error && (
					<p className="text-sm text-destructive">{error.message}</p>
				)}
			</form>
		</div>
	);
}
