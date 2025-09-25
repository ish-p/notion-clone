"use client";
import { useParams } from "next/navigation";
import DocumentContent from "./DocumentContent";

export default function DocumentPage() {
	const params = useParams();
	const { id } = params;

	if (!id || !id.toString()) {
		return <div>Error</div>;
	}

	return (
		<div>
			<div>{id.toString()}</div>
			<DocumentContent docId={id.toString()} />
		</div>
	);
}
