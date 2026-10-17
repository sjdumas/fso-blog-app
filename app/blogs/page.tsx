interface Blog {
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

export default function BlogsPage() {
	return (
		<div>
			<h1>Blogs</h1>
			<ul>
				{blogs.map((blog) => (
					<li key={blog.id}>
						<a href={blog.url}>{blog.title}</a> by {blog.author} ({blog.likes} likes)
					</li>
				))}
			</ul>
		</div>
	);
}
