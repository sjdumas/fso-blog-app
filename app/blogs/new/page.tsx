import { createBlog } from "../actions";

export default function NewBlogPage() {
    return (
        <div>
            <h1>Create a New Blog</h1>
            <form action={createBlog}>
                <div>
                    <label htmlFor="title">Title</label>
                    <input id="title" name="title" type="text" required />
                </div>
                <div>
                    <label htmlFor="author">Author</label>
                    <input id="author" name="author" type="text" required />
                </div>
                <div>
                    <label htmlFor="url">URL</label>
                    <input id="url" name="url" type="url" required />
                </div>
                <button type="submit">Create</button>
            </form>
        </div>
    );
}
