import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
    title: "Blog App",
    description: "A blog list application built with Next.js",
};

export default function RootLayout({
    children,
}: Readonly<{
	children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <nav style={{ display: "flex", gap: "1rem", padding: "1rem" }}>
                    <Link href="/">Home</Link>
                    <Link href="/blogs">Blogs</Link>
                    <Link href="/users">Users</Link>
                </nav>
                <main style={{ padding: "1rem" }}>{children}</main>
            </body>
        </html>
    );
}
