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

const navLinkClass = "font-medium text-foreground no-underline hover:text-muted";

async function UserGreeting() {
  await connection();
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  return <span className="text-muted">{session.user.name} logged in</span>;
}

async function UserStatus() {
  await connection();
  const session = await auth();

  if (!session?.user) {
    return (
      <span className="flex items-center gap-4">
        <Link href="/login" className={navLinkClass}>
          Log in
        </Link>
        <Link href="/register" className={navLinkClass}>
          Register
        </Link>
      </span>
    );
  }

  return (
    <span className="flex items-center gap-4">
      <Link href="/blogs/new" className={navLinkClass}>
        New blog
      </Link>
      <Link href="/me" className={navLinkClass}>
        Me
      </Link>
      <form action={logout}>
        <button
          type="submit"
          className="inline-flex items-center rounded-md border border-border bg-transparent px-3 py-1.5 leading-none text-foreground hover:bg-border hover:text-foreground"
        >
          Log out
        </button>
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
    <html lang="en" className={geist.variable}>
      <body suppressHydrationWarning>
        <NotificationProvider>
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-border bg-surface px-[max(1rem,calc((100%-46rem)/2))] py-4 text-[0.95rem]">
            <Link
              href="/"
              className="mr-auto basis-full text-lg font-bold tracking-tight text-foreground no-underline hover:text-muted sm:basis-auto"
            >
              Blog App
            </Link>
            <Suspense fallback={null}>
              <UserGreeting />
            </Suspense>
            <Link href="/blogs" className={navLinkClass}>
              Blogs
            </Link>
            <Link href="/users" className={navLinkClass}>
              Users
            </Link>
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
