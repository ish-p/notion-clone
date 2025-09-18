import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "Notion Clone",
	description: "Notion Clone",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>
				<Header />
				<div className="flex min-h-screen">
					<Sidebar />
					<div className="flex-1 p-4 bg-gray-100 overflow-y-auto scrollbar-hide">
						{children}
					</div>
				</div>
			</body>
		</html>
	);
}
