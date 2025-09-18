import { auth } from "@/auth";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOutIcon } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { LogoutForm } from "./auth/logout_form";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default async function ProfileMenu() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	if (!session) {
		return <></>;
	}

	const user = session?.user;
	const name = session?.user.name.split(" ")[0];

	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<Avatar>
					<AvatarImage src={user.image!} alt="@avatar" />
					<AvatarFallback>{name.charAt(0)}</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuGroup>
					<DropdownMenuLabel className="text-gray-600">
						My Account
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem>
						<Link href="/profile">Profile</Link>
					</DropdownMenuItem>
					<DropdownMenuItem>
						<Link href="/home">Home</Link>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem className="text-red-500">
					<LogOutIcon />
					<LogoutForm />
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
