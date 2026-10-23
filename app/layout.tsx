import { connection } from "next/server";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { auth } from "@/auth";
import { logout } from "@/lib/auth-actions";
import { themeInitScript } from "@/lib/theme";
import Footer from "./Footer";
import ThemeToggle from "./ThemeToggle";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blog App",
  description: "A blog list application built with Next.js",
};

async function UserGreeting() {
  await connection();
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  return <span>{session.user.name} logged in</span>;
}

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
    <form action={logout}>
      <button type="submit">Log out</button>
    </form>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <nav>
          <Link href="/" className="nav-title">
            Blog App
          </Link>
          <Suspense fallback={null}>
            <UserGreeting />
          </Suspense>
          <Link href="/blogs">Blogs</Link>
          <Link href="/users">Users</Link>
          <Suspense fallback={null}>
            <UserStatus />
          </Suspense>
          <ThemeToggle />
        </nav>
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
