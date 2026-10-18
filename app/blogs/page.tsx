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
						<a href={blog.url}>{blog.title}</a> by {blog.author} (
						{blog.likes} likes)
					</li>
				))}
			</ul>
		</div>
	);
}
