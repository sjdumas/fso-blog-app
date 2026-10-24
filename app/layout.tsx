import { connection } from "next/server";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import { Suspense } from "react";
import { auth } from "@/auth";
import { logout } from "@/lib/auth-actions";
import NotificationBanner from "@/components/NotificationBanner";
import { NotificationProvider } from "@/components/NotificationContext";
import Footer from "@/components/Footer";
import "./globals.css";

// Self-hosted at build time; exposed as a CSS variable used by --font-sans
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

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
    <html lang="en" className={geist.variable}>
      <body>
        <NotificationProvider>
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
          </nav>
          <NotificationBanner />
          <main>{children}</main>
          <Footer />
        </NotificationProvider>
      </body>
    </html>
  );
}
