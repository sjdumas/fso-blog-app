export interface Blog {
	id: number;
	title: string;
	author: string;
	url: string;
	likes: number;
}

const blogs: Blog[] = [
    {
        id: 1,
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
    },
    {
        id: 2,
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
        likes: 5,
    },
    {
        id: 3,
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
        likes: 12,
    },
];

export function getBlogs(): Blog[] {
    return blogs;
}

export function getBlogById(id: number): Blog | undefined {
    return blogs.find((blog) => blog.id === id);
}

export function addBlog(title: string, author: string, url: string): Blog {
    const maxId = Math.max(0, ...blogs.map((blog) => blog.id));

    const newBlog: Blog = {
        id: maxId + 1,
        title,
        author,
        url,
        likes: 0,
    };

    blogs.push(newBlog);
    return newBlog;
}
