import { notFound } from "next/navigation";
import { getBlogById } from "@/lib/blogs";
import { likeBlog } from "../actions";

interface BlogPageProps {
    params: Promise<{ id: string }>;
}

export default async function BlogPage({ params }: BlogPageProps) {
    const { id } = await params;
    const blog = await getBlogById(Number(id));

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
            <form action={likeBlog}>
                <input type="hidden" name="id" value={blog.id} />
                <button type="submit">Like</button>
            </form>
        </div>
    );
}
