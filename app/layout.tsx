import "./globals.css";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import Navbar from "./(shared)/Navbar";
import Footer from "./(shared)/Footer";
import SessionProvider from "./SessionProvider";

const openSans = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Blog AI App",
	description: "Built in Next JS",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className={openSans.className} suppressHydrationWarning={true}>
				<SessionProvider>
						<Navbar />
						{children}
						<Footer />
				</SessionProvider>
			</body>
		</html>
	);
}
