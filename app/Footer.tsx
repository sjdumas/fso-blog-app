import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <div>
        <div>
          <p className="footer-title">Blog App</p>
          <p>A place to share and discover great blogs.</p>
        </div>
        <ul>
          <li>
            <Link href="/blogs">Blogs</Link>
          </li>
          <li>
            <Link href="/users">Users</Link>
          </li>
        </ul>
      </div>
      <p className="footer-credit">
        Built with <a href="https://nextjs.org">Next.js</a>
      </p>
    </footer>
  );
}
