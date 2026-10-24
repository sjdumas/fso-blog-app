import { redirect } from "next/navigation";
import { connection } from "next/server";
import { auth } from "@/auth";
import { buttonClass } from "@/lib/styles";
import { getUserWithToken } from "@/lib/users";
import { generateToken } from "./actions";

export default async function MePage() {
  await connection();
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await getUserWithToken(Number(session.user.id));

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
    </div>
  );
}
