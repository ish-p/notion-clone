"use client";
import { createNewDocument } from "@/actions/document";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState, useTransition } from "react";
import { Button } from "./ui/button";
import { Spinner } from "./ui/shadcn-io/spinner";

export default function NewDocumentButton({
	setOpen,
}: {
	setOpen: Dispatch<SetStateAction<boolean>>;
}) {
	const router = useRouter();
	const [pending, startTransition] = useTransition();
	const [error, setError] = useState("");

	const handleNewDocument = () => {
		startTransition(async () => {
			const docId = await createNewDocument();
			console.log(docId);
			if (docId) {
				setOpen(false);
				router.push(`/doc/${docId}`);
			} else {
				setError("Unable to create document. Try again later.");
			}
		});
	};
	return (
		<>
			<Button onClick={handleNewDocument} disabled={pending}>
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
