import Link from "next/link";
import { connection } from "next/server";
import { auth } from "@/auth";
import BlogForm from "./BlogForm";

export default async function NewBlogPage() {
  await connection();
  const session = await auth();

  return (
    <div>
      <h1>Create a new blog</h1>
      {session?.user ? (
        <BlogForm />
      ) : (
        <p className="text-muted">
          You need to <Link href="/login">log in</Link> to create a blog.
        </p>
      )}
    </div>
  );
}
