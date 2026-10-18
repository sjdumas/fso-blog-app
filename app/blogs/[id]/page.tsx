import { notFound } from "next/navigation";
import { getBlogById } from "@/lib/blogs";

interface BlogPageProps {
	params: Promise<{ id: string }>;
}

export default async function BlogPage({ params }: BlogPageProps) {
	const { id } = await params;
	const blog = getBlogById(Number(id));

	if (!blog) {
		notFound();
	}

	return (
		<div>
			<h1>{blog.title}</h1>
			<p>Author: {blog.author}</p>
			<p>
				URL: <a href={blog.url}>{blog.url}</a>
			</p>
			<p>Likes: {blog.likes}</p>
		</div>
	);
}
