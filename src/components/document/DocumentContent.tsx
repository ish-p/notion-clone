"use client";

import { detailedDocsFormat } from "@/actions/document";

export default function DocumentContent({
	data,
}: {
	data: detailedDocsFormat;
}) {
	return (
		<div className="flex">
			{data._id} {data.name} {data.ownerId} {data.ownerEmail}{" "}
			{data.editors}{" "}
		</div>
	);
}
