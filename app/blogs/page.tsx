import Link from "next/link";
import { Suspense } from "react";
import { getBlogs } from "@/lib/blogs";

interface BlogsPageProps {
  searchParams: Promise<{ filter?: string | string[] }>;
}

async function FilteredBlogList({ searchParams }: BlogsPageProps) {
  const { filter } = await searchParams;
  const searchTerm = typeof filter === "string" ? filter : "";

  const blogs = await getBlogs(searchTerm);

  return (
    <div>
      <div className="toolbar">
        <Link href="/blogs/new" className="button-link">
          Create New Blog
        </Link>
        <form action="/blogs">
          <input
            type="text"
            name="filter"
            defaultValue={searchTerm}
            placeholder="Search by title"
            aria-label="Search blogs by title"
          />
          <button type="submit">Search</button>
        </form>
      </div>
      {blogs.length === 0 ? (
        <p>No blogs match your search.</p>
      ) : (
        <ul>
          {blogs.map((blog) => (
            <li key={blog.id}>
              <Link href={`/blogs/${blog.id}`}>{blog.title}</Link> by{" "}
              {blog.author} ({blog.likes} likes)
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function BlogsPage({ searchParams }: BlogsPageProps) {
  return (
    <div>
      <h1>Blogs</h1>
      <Suspense fallback={<p>Loading blogs...</p>}>
        <FilteredBlogList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
