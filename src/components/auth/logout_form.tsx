import { Button } from "@/components/ui/button";
import { logout } from "@/lib/auth/auth_utils";
import { cn } from "@/lib/utils";

export async function LogoutForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<div className="flex flex-col gap-3">
				<form action={logout}>
					<Button type="submit" variant="outline" className="w-full">
						Logout
					</Button>
				</form>
			</div>
		</div>
	);
}
