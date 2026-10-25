import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { auth } from "@/auth";
import { getBlogs } from "@/lib/blogs";
import { buttonClass, inputClass } from "@/lib/styles";

interface BlogsPageProps {
  searchParams: Promise<{ filter?: string | string[] }>;
}

async function FilteredBlogList({ searchParams }: BlogsPageProps) {
  await connection();
  const { filter } = await searchParams;
  const searchTerm = typeof filter === "string" ? filter : "";

  const [blogs, session] = await Promise.all([getBlogs(searchTerm), auth()]);

  return (
    <div>
      <div className="my-4 flex items-center justify-between gap-4">
        {session?.user && (
          <Link
            href="/blogs/new"
            className={`${buttonClass} shrink-0 whitespace-nowrap`}
          >
            Create new blog
          </Link>
        )}
        <form
          action="/blogs"
          className="m-0 ml-auto flex max-w-none min-w-0 flex-initial flex-row gap-2"
        >
          <input
            type="text"
            name="filter"
            data-testid="filter-input"
            defaultValue={searchTerm}
            placeholder="Search by title"
            aria-label="Search blogs by title"
            className={`${inputClass} min-w-0 flex-[1_1_14rem]`}
          />
          <button type="submit" data-testid="search-button" className={buttonClass}>
            Search
          </button>
        </form>
      </div>
      <div data-testid="blogs-list">
        {blogs.length === 0 ? (
          <p className="text-muted">No blogs match your search.</p>
        ) : (
          <ul className="mt-4 flex flex-col gap-2">
            {blogs.map((blog) => (
              <li
                key={blog.id}
                className="flex items-center justify-between gap-4 rounded-lg border border-border bg-surface px-4 py-3 transition-colors hover:border-muted"
              >
                <div className="min-w-0">
                  <Link
                    href={`/blogs/${blog.id}`}
                    className="font-semibold text-foreground no-underline hover:text-muted"
                  >
                    {blog.title}
                  </Link>
                  <p className="m-0 text-sm text-muted">by {blog.author}</p>
                </div>
                <span className="shrink-0 rounded-full border border-border px-3 py-0.5 text-sm text-muted">
                  {blog.likes} {blog.likes === 1 ? "like" : "likes"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function BlogsPage({ searchParams }: BlogsPageProps) {
  return (
    <div>
      <h1>Blogs</h1>
      <Suspense fallback={<p className="text-muted">Loading blogs...</p>}>
        <FilteredBlogList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
