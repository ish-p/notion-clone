"use client";
import { docsFormat, getDocumentsByUserId } from "@/actions/document";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Spinner } from "./ui/shadcn-io/spinner";

export default function MyDocuments() {
	const [data, setData] = useState<docsFormat[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			const docs = await getDocumentsByUserId();
			setData(docs);
			setLoading(false);
		};
		fetchData(); // Call the async function
	}, []);

	if (loading) return <Spinner key="circle" variant="circle" />;

	return (
		<>
			{data.map((item) => (
				<Link key={item.docId} href={`/doc/${item.docId}`}>
					{item.name}
				</Link>
			))}
		</>
	);
}
