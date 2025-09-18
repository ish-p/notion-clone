import { Button } from "@/components/ui/button";
import { logout } from "@/lib/auth/auth_utils";
import { cn } from "@/lib/utils";

export async function LogoutForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<form action={logout}>
				<Button
					type="submit"
					variant="link"
					className="w-full p-0 m-0 text-red-500"
				>
					Logout
				</Button>
			</form>
		</div>
	);
}
