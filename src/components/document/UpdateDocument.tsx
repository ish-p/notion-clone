import { detailedDocsFormat, updateDocumentMeta } from "@/actions/document";
import { FormEvent, useEffect, useState, useTransition } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Spinner } from "../ui/shadcn-io/spinner";

export default function UpdateDocument({ data }: { data: detailedDocsFormat }) {
	const [input, setInput] = useState("");
	const [error, setError] = useState("");
	const [isUpdating, startTransition] = useTransition();

	const updateTitle = (e: FormEvent) => {
		e.preventDefault();
		if (input.trim()) {
			startTransition(async () => {
				await updateDocumentMeta(data._id, {
					title: input,
				});
			});
		} else {
			setError("Title must not be empty!");
		}
	};

	useEffect(() => {
		setInput(data.name);
	}, [data]);

	return (
		<div className="flex flex-col">
			<form onSubmit={updateTitle}>
				<Input
					className="border-gray-400"
					value={input}
					onChange={(e) => {
						if (error) {
							setError("");
						}
						setInput(e.target.value);
					}}
				/>
				<Button disabled={isUpdating} type="submit" className="w-24">
					{isUpdating ? (
						<Spinner key="nameUpdate" variant="ellipsis" />
					) : (
						"Update"
					)}
				</Button>
				<p className="text-sm text-destructive">{error}</p>

				{/* IF owner */}
				{/* isOwner && InviteUser, Delete Document */}
			</form>
		</div>
	);
}
