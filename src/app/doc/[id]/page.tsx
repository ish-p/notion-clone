"use client";
import { getDocumentById, type detailedDocsFormat } from "@/actions/document";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Doc() {
	const params = useParams();
	const { id } = params;

	const [pending, setPending] = useState(false);
	const [error, setError] = useState("");
	const [data, setData] = useState<detailedDocsFormat>();

	useEffect(() => {
		const fetchDoc = async () => {
			setPending(true);
			if (id && id.toString()) {
				const doc = await getDocumentById(id?.toString());
				if (doc) {
					setData(doc);
					setPending(false);
					return;
				}
			}
			setError("Document does not exist.");
			setPending(false);
		};
		fetchDoc();
	}, [id]);
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
