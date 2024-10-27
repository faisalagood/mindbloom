import localFont from "next/font/local";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const clash = localFont({
	src: [
		{
			path: "./fonts/ClashDisplay-Semibold.woff2",
			weight: "600",
			style: "normal"
		},
		{
			path: "./fonts/ClashDisplay-Medium.woff2",
			weight: "500",
			style: "normal"
		}
	],
	variable: "--font-clash"
});

const dmSans = DM_Sans({
	subsets: ["latin"],
	variable: "--font-dm-sans",
	weight: ["400", "500", "700"]
});

export const metadata = {
	title: "Mindbloom",
	description: "Bloom into your best self."
};

export default function RootLayout({ children }) {
	return (
		<html lang="en" className={`${clash.variable} ${dmSans.variable}`}>
			<head>
				<meta name="theme-color" content="#7e22ce" />
				<meta name="apple-mobile-web-app-status-bar-style" content="#7e22ce" />
			</head>
			<body>{children}</body>
		</html>
	);
}