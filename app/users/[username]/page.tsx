import Link from "next/link";
import { notFound } from "next/navigation";
import { getUserByUsername } from "@/lib/users";

interface UserPageProps {
    params: Promise<{ username: string }>;
}

export default async function UserPage({ params }: UserPageProps) {
    const { username } = await params;
    const user = await getUserByUsername(username);

    if (!user) {
        notFound();
    }

    return (
        <div>
            <h1>{user.name}</h1>
            <h2>Added blogs</h2>
            {user.blogs.length === 0 ? (
                <p>No blogs added yet.</p>
            ) : (
                <ul>
                    {user.blogs.map((blog) => (
                        <li key={blog.id}>
                            <Link href={`/blogs/${blog.id}`}>{blog.title}</Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
