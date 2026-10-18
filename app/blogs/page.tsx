import Link from "next/link";
import { getBlogs } from "@/lib/blogs";

export default function BlogsPage() {
	const blogs = getBlogs();

	return (
		<div>
			<h1>Blogs</h1>
			<Link href="/blogs/new">Create new blog</Link>
			<ul>
				{blogs.map((blog) => (
					<li key={blog.id}>
					<Link href={`/blogs/${blog.id}`}>{blog.title}</Link> by {blog.author}
					</li>
				))}
			</ul>
		</div>
	);
}
