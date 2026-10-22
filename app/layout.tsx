import { connection } from "next/server";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { auth } from "@/auth";
import { logout } from "@/lib/auth-actions";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blog App",
  description: "A blog list application built with Next.js",
};

async function UserStatus() {
  await connection();
  const session = await auth();

  if (!session?.user) {
    return (
      <span style={{ display: "flex", gap: "1rem" }}>
        <Link href="/login">Log in</Link>
        <Link href="/register">Register</Link>
      </span>
    );
  }

  return (
    <span style={{ display: "flex", gap: "0.5rem" }}>
      {session.user.name} logged in
      <form action={logout}>
        <button type="submit">Log out</button>
      </form>
    </span>
  );
}

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
          <Suspense fallback={null}>
            <UserStatus />
          </Suspense>
        </nav>
        <main style={{ padding: "1rem" }}>{children}</main>
      </body>
    </html>
  );
}
