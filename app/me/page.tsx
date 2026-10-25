import { redirect } from "next/navigation";
import { connection } from "next/server";
import { auth } from "@/auth";
import { buttonClass } from "@/lib/styles";
import { getUserWithToken } from "@/lib/users";
import { generateToken, markAsRead } from "./actions";
import Link from "next/link";
import { getReadingList } from "@/lib/readingList";

type ReadingListEntry = Awaited<ReturnType<typeof getReadingList>>[number];

function ReadingListItem({ entry }: { entry: ReadingListEntry }) {
  return (
    <li className="flex items-center justify-between gap-4 rounded-md border border-border bg-background px-4 py-3">
      <div className="min-w-0">
        <Link
          href={`/blogs/${entry.blog.id}`}
          className="font-semibold text-foreground no-underline hover:text-muted"
        >
          {entry.blog.title}
        </Link>
        <p className="m-0 text-sm text-muted">by {entry.blog.author}</p>
      </div>
      {!entry.read && (
        <form action={markAsRead} className="m-0 max-w-none shrink-0 flex-row">
          <input type="hidden" name="entryId" value={entry.id} />
          <button type="submit" data-testid={`mark-read-${entry.id}`} className={buttonClass}>
            Mark as read
          </button>
        </form>
      )}
    </li>
  );
}

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

  const unread = readingList.filter((entry) => !entry.read);
  const read = readingList.filter((entry) => entry.read);

  return (
    <div>
      <h1>My Profile</h1>
      <section
        data-testid="user-profile"
        className="rounded-lg border border-border bg-surface p-6"
      >
        <p className="m-0 text-lg font-semibold">
          Name:{" "}
          <span data-testid="user-name" className="font-normal">
            {user.name}
          </span>
        </p>
        <p className="m-0 text-lg font-semibold">
          Username:{" "}
          <span data-testid="user-username" className="font-normal">
            @{user.username}
          </span>
        </p>
      </section>
      <section
        data-testid="reading-list-section"
        className="mt-6 rounded-lg border border-border bg-surface p-6"
      >
        <h2 className="mt-0">Reading list</h2>
        {readingList.length === 0 ? (
          <p data-testid="empty-reading-list" className="mb-0 text-muted">
            Your reading list is empty.
          </p>
        ) : (
          <>
            <div data-testid="unread-section">
              <h3 className="mb-2 text-base font-semibold">
                Unread ({unread.length})
              </h3>
              {unread.length === 0 ? (
                <p data-testid="no-unread-blogs" className="text-sm text-muted">
                  You&apos;ve read everything on your list.
                </p>
              ) : (
                <ul className="m-0 flex flex-col gap-2">
                  {unread.map((entry) => (
                    <ReadingListItem key={entry.id} entry={entry} />
                  ))}
                </ul>
              )}
            </div>
            <div data-testid="read-section">
              <h3 className="mt-6 mb-2 text-base font-semibold">
                Read ({read.length})
              </h3>
              {read.length === 0 ? (
                <p className="mb-0 text-sm text-muted">
                  Nothing marked as read yet.
                </p>
              ) : (
                <ul className="m-0 flex flex-col gap-2">
                  {read.map((entry) => (
                    <ReadingListItem key={entry.id} entry={entry} />
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </section>
      <section
        data-testid="api-token-section"
        className="mt-6 rounded-lg border border-border bg-surface p-6"
      >
        <h2 className="mt-0">API Token</h2>
        {user.token ? (
          <div data-testid="token-display">
            <code
              data-testid="api-token"
              className="block rounded-md border border-border bg-background px-3 py-2 font-mono text-sm break-all"
            >
              {user.token}
            </code>
          </div>
        ) : (
          <p data-testid="no-token-message" className="text-muted">
            No token has been generated yet.
          </p>
        )}
        <form action={generateToken} className="mt-4 mb-0">
          <button
            type="submit"
            data-testid="generate-token-button"
            className={buttonClass}
          >
            {user.token ? "Generate New Token" : "Generate Token"}
          </button>
        </form>
        {user.token && (
          <p className="mt-2 mb-0 text-sm text-muted">
            Generating a new token replaces the current one.
          </p>
        )}
      </section>
    </div>
  );
}
