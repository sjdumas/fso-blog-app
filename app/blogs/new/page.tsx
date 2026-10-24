import { redirect } from "next/navigation";
import { connection } from "next/server";
import { auth } from "@/auth";
import BlogForm from "./BlogForm";

export default async function NewBlogPage() {
  await connection();
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div>
      <h1>Create a new blog</h1>
      <BlogForm />
    </div>
  );
}
