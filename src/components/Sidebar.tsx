"use client";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import { useState } from "react";
import MyDocuments from "./MyDocuments";
import NewDocumentButton from "./NewDocumentButton";

export default function Sidebar() {
	const [open, setOpen] = useState(false);

	const menuOptions = (
		<>
			<NewDocumentButton setOpen={setOpen} />
			<MyDocuments />
		</>
	);

	return (
		<div className="p-2 md:5 bg-gray-200 relative">
			<div className="md:hidden">
				<Sheet open={open} onOpenChange={setOpen}>
					<SheetTrigger>
						<MenuIcon />
					</SheetTrigger>
					<SheetContent side="left">
						<SheetHeader>
							<SheetTitle>Menu</SheetTitle>
							{menuOptions}
						</SheetHeader>
					</SheetContent>
				</Sheet>
			</div>
			<div className="hidden md:inline">{menuOptions}</div>
		</div>
	);
}
