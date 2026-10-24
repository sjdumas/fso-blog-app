import { redirect } from "next/navigation";
import { connection } from "next/server";
import { auth } from "@/auth";
import { buttonClass } from "@/lib/styles";
import { getUserWithToken } from "@/lib/users";
import { generateToken } from "./actions";
import Link from "next/link";
import { getReadingList } from "@/lib/readingList";

export default async function MePage() {
  await connection();
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = Number(session.user.id);
  const [user, readingList] = await Promise.all([
    getUserWithToken(userId),
    getReadingList(userId),
  ]);

  if (!user) {
    redirect("/login");
  }

  return (
    <div>
      <h1>My profile</h1>
      <section className="rounded-lg border border-border bg-surface p-6">
        <p className="m-0 text-lg font-semibold">Name: <span className="font-normal">{user.name}</span></p>
        <p className="m-0 text-lg font-semibold">Username: <span className="font-normal">@{user.username}</span></p>
      </section>
      <section className="mt-6 rounded-lg border border-border bg-surface p-6">
        <h2 className="mt-0">API token</h2>
        {user.token ? (
          <code className="block rounded-md border border-border bg-background px-3 py-2 font-mono text-sm break-all">
            {user.token}
          </code>
        ) : (
          <p className="text-muted">No token has been generated yet.</p>
        )}
        <form action={generateToken} className="mt-4 mb-0">
          <button type="submit" className={buttonClass}>
            {user.token ? "Generate new token" : "Generate token"}
          </button>
        </form>
        {user.token && (
          <p className="mt-2 mb-0 text-sm text-muted">
            Generating a new token replaces the current one.
          </p>
        )}
      </section>
      <section className="mt-6 rounded-lg border border-border bg-surface p-6">
        <h2 className="mt-0">Reading list</h2>
        {readingList.length === 0 ? (
          <p className="mb-0 text-muted">Your reading list is empty.</p>
        ) : (
          <ul className="m-0 flex flex-col gap-2">
            {readingList.map((entry) => (
              <li
                key={entry.id}
                className="flex items-center justify-between gap-4 rounded-md border border-border bg-background px-4 py-3"
              >
                <div className="min-w-0">
                  <Link
                    href={`/blogs/${entry.blog.id}`}
                    className="font-semibold text-foreground no-underline hover:text-muted"
                  >
                    {entry.blog.title}
                  </Link>
                  <p className="m-0 text-sm text-muted">
                    by {entry.blog.author}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full border px-3 py-0.5 text-sm ${entry.read ? "border-green-600 text-green-700" : "border-border text-muted"}`}
                >
                  {entry.read ? "Read" : "Unread"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
