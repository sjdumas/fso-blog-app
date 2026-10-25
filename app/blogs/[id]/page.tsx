import { notFound } from "next/navigation";
import { connection } from "next/server";
import { auth } from "@/auth";
import { getBlogById } from "@/lib/blogs";
import { isOnReadingList } from "@/lib/readingList";
import { buttonClass } from "@/lib/styles";
import { likeBlog, saveToReadingList } from "../actions";

interface BlogPageProps {
  params: Promise<{ id: string }>;
}

export default async function BlogPage({ params }: BlogPageProps) {
  await connection();
  const { id } = await params;
  const blog = await getBlogById(Number(id));

  if (!blog) {
    notFound();
  }

  const session = await auth();
  const userId = session?.user?.id ? Number(session.user.id) : null;
  const isOwner = userId !== null && blog.userId === userId;
  const onReadingList =
    userId !== null && !isOwner && (await isOnReadingList(userId, blog.id));

  return (
    <article data-testid="blog-detail" className="rounded-lg border border-border bg-surface p-6">
      <h1 data-testid="blog-title" className="mb-2">{blog.title}</h1>
      <p data-testid="blog-author" className="text-muted">by {blog.author}</p>
      <a
        href={blog.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm break-all"
      >
        {blog.url}
      </a>
      <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-border pt-4">
        <span className="text-muted">
          <strong className="text-foreground">{blog.likes}</strong>{" "}
          {blog.likes === 1 ? "like" : "likes"}
        </span>
        <form action={likeBlog} className="m-0 max-w-none flex-row">
          <input type="hidden" name="id" value={blog.id} />
          <button type="submit" className={buttonClass}>
            Like
          </button>
        </form>
        {userId !== null &&
          !isOwner &&
          (onReadingList ? (
            <p className="m-0 ml-auto text-sm text-muted">
              On your reading list
            </p>
          ) : (
            <form
              action={saveToReadingList}
              className="m-0 ml-auto max-w-none flex-row"
            >
              <input type="hidden" name="blogId" value={blog.id} />
              <button type="submit" data-testid="add-to-reading-list-button" className={buttonClass}>
                Add to reading list
              </button>
            </form>
          ))}
      </div>
    </article>
  );
}
