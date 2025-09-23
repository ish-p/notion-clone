"use client";
import { createNewDocument, docsFormat } from "@/actions/document";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState, useTransition } from "react";
import { Button } from "./ui/button";
import { Spinner } from "./ui/shadcn-io/spinner";

export default function NewDocumentButton({
	setOpen,
	data,
	setData,
}: {
	setOpen: Dispatch<SetStateAction<boolean>>;
	data: docsFormat[];
	setData: Dispatch<SetStateAction<docsFormat[]>>;
}) {
	const router = useRouter();
	const [pending, startTransition] = useTransition();
	const [error, setError] = useState("");

	const handleNewDocument = () => {
		startTransition(async () => {
			const doc = await createNewDocument();
			if (doc) {
				setOpen(false);
				setData([
					...data,
					{
						docId: doc._id,
						name: doc.name,
						role: "owner",
					},
				]);

				router.push(`/doc/${doc._id}`);
			} else {
				setError("Unable to create document. Try again later.");
			}
		});
	};
	return (
		<>
			<Button
				onClick={handleNewDocument}
				disabled={pending}
				className="min-w-full m-0 p-0"
			>
				{pending ? (
					<Spinner key="circle" variant="circle" />
				) : (
					<>New Document</>
				)}
			</Button>
			{error && <p className="text-sm text-destructive">{error}</p>}
		</>
	);
}
