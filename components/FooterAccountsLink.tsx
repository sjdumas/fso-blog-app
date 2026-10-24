import Link from "next/link";
import { connection } from "next/server";
import { auth } from "@/auth";
import { logout } from "@/lib/auth-actions";

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
    <>
      <li>
        <Link href="/me">Me</Link>
      </li>
      <li>
        <form action={logout}>
          <button
            type="submit"
            className="cursor-pointer bg-transparent p-0 text-sm font-normal text-accent hover:bg-transparent hover:text-accent-hover"
          >
            Log out
          </button>
        </form>
      </li>
    </>
  );
}
