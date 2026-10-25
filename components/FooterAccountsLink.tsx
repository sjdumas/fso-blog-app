import Link from "next/link";
import { connection } from "next/server";
import { auth } from "@/auth";

export default async function FooterAccountLinks() {
  await connection();
  const session = await auth();

  if (!session?.user) {
    return (
      <>
        <li>
          <Link href="/login">Log in</Link>
        </li>
        <li>
          <Link href="/register">Register</Link>
        </li>
      </>
    );
  }

  return (
    <li>
      <Link href="/me">Me</Link>
    </li>
  );
}
