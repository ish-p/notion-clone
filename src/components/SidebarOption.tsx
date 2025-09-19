import Link from "next/link";

export default function SidebarOption({
	docId,
	name,
}: {
	docId: string;
	name: string;
}) {
	return <Link href={`/doc/${docId}`}>{name}</Link>;
}
