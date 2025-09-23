"use client";
import { docsFormat, getDocumentsByUserId } from "@/actions/document";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import { useEffect, useState } from "react";
import NewDocumentButton from "./NewDocumentButton";
import SidebarOption from "./SidebarOption";
import { Spinner } from "./ui/shadcn-io/spinner";

export default function Sidebar() {
	const [data, setData] = useState<docsFormat[]>([]);
	const [loading, setLoading] = useState(true);

	const [open, setOpen] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			const docs = await getDocumentsByUserId();
			setData(docs);
			setLoading(false);
		};
		fetchData();
	}, []);

	const menuOptions = (
		<>
			<NewDocumentButton setOpen={setOpen} />
			{loading ? (
				<Spinner key="circle" variant="circle" />
			) : (
				// First seperate into owner and editor arrays
				data.map((item) => (
					<SidebarOption
						key={item.docId}
						docId={item.docId}
						name={item.name}
					/>
				))
			)}
		</>
	);

	return (
		<div className="p-2 md:5 bg-gray-200 relative">
			<div className="md:hidden shrink-0">
				<Sheet open={open} onOpenChange={setOpen}>
					<SheetTrigger>
						<MenuIcon />
					</SheetTrigger>
					<SheetContent side="left" className="max-w-3xs">
						<SheetHeader>
							<SheetTitle className="mb-4">Menu</SheetTitle>
							{menuOptions}
						</SheetHeader>
					</SheetContent>
				</Sheet>
			</div>
			<div className="hidden md:inline-flex flex-wrap flex-none items-center align-middle justify-center overflow-clip gap-4 w-32">
				{menuOptions}
			</div>
		</div>
	);
}
