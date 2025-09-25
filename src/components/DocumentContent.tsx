"use client";
import { detailedDocsFormat, getDocumentById } from "@/actions/document";
import { useEffect, useState } from "react";
import { Spinner } from "./ui/shadcn-io/spinner";

export default function DocumentContent({ docId }: { docId: string }) {
	const [pending, setPending] = useState(false);
	const [error, setError] = useState("");
	const [data, setData] = useState<detailedDocsFormat>();

	useEffect(() => {
		const fetchDoc = async () => {
			setPending(true);
			const doc = await getDocumentById(docId.toString());
			if (doc) {
				setData(doc);
			} else {
				setError("Document does not exist.");
			}
			setPending(false);
		};
		fetchDoc();
	}, [docId]);

	return (
		<>
			{pending ? (
				<Spinner key="circle" variant="circle" />
			) : (
				data &&
				!error && (
					<div className="flex">
						{data._id} {data.name} {data.ownerId} {data.ownerEmail}{" "}
						{data.editors}{" "}
					</div>
				)
			)}
			{error && <p className="text-sm text-destructive">{error}</p>}
		</>
	);
}
