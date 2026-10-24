import { cacheLife } from "next/cache";
import Link from "next/link";

// Cached so the page can still be prerendered; refreshes daily, so the
// year rolls over on its own
async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

export default function Footer() {
  return (
    <footer>
      <div>
        <div>
          <p className="footer-title">
            <Link href="/">Blog App</Link>
          </p>
          <p>A place to share and discover great blogs</p>
        </div>
        <div className="footer-columns">
          <div>
            <h2>Explore</h2>
            <ul>
              <li>
                <Link href="/blogs">Blogs</Link>
              </li>
              <li>
                <Link href="/users">Users</Link>
              </li>
            </ul>
          </div>
          <div>
            <h2>Account</h2>
            <ul>
              <li>
                <Link href="/login">Log in</Link>
              </li>
              <li>
                <Link href="/register">Register</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <p className="footer-credit">
        <span>
          © <CurrentYear /> Blog App
        </span>
        <span>
          Built with <a target="_blank" href="https://nextjs.org">Next.js</a>
        </span>
      </p>
    </footer>
  );
}
