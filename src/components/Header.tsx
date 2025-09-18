import { auth } from "@/auth";
import { headers } from "next/headers";
import Link from "next/link";
import ProfileMenu from "./ProfileMenu";

export default async function Header() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	const user = session?.user;
	const name = session?.user.name.split(" ")[0];

	return (
		<div className="flex shrink-0 items-center justify-between shadow-lg w-screen p-5">
			<span className="group -mt-5 pt-5 pb-5 -mb-5">
				{user ? (
					<h1 className="group-hover:scale-103 transition duration-250 text-xl">
						{name}&apos;s Space
					</h1>
				) : (
					<h1 className="group-hover:scale-103 transition duration-250 text-xl">
						Your Workspace
					</h1>
				)}
			</span>
			{/* Breadcrumbs */}
			{!user ? (
				<Link href="/login" className="hover:scale-110 duration-500">
					Login
				</Link>
			) : (
				<ProfileMenu />
			)}
		</div>
	);
}
