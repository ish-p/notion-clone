import Link from "next/link";
import { Dispatch, SetStateAction } from "react";

export default function SidebarOption({
	docId,
	name,
	setOpen,
}: {
	docId: string;
	name: string;
	setOpen: Dispatch<SetStateAction<boolean>>;
}) {
	return (
		<Link
			href={`/doc/${docId}`}
			onClick={async () => {
				setOpen(false);
			}}
		>
			{name}
		</Link>
	);
}
