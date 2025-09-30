"use client";
import { detailedDocsFormat, getDocumentById } from "@/actions/document";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Spinner } from "../ui/shadcn-io/spinner";
import DocumentContent from "./DocumentContent";
import UpdateDocument from "./UpdateDocument";
import UserBar from "./UserBar";

export default function DocumentPage() {
	const params = useParams();
	const { id } = params;

	const [error, setError] = useState("");
	const [data, setData] = useState<detailedDocsFormat | null>(null);

	useEffect(() => {
		if (id && id.toString()) {
			const fetchDoc = async () => {
				const doc = await getDocumentById(id.toString());
				if (doc) {
					setData(doc);
				} else {
					setError("Document does not exist.");
				}
			};
			fetchDoc();
		} else {
			setError("Document ID not found.");
		}
	}, [id]);

	if (error) {
		return <p className="text-sm text-destructive">{error}</p>;
	}

	return (
		<>
			{!data ? (
				<Spinner key="circle" variant="circle" />
			) : (
				<div>
					<UpdateDocument data={data} />
					<UserBar data={data} />
					<DocumentContent data={data} />
				</div>
			)}
		</>
	);
}
