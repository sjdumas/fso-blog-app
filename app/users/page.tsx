import Link from "next/link";
import { Suspense } from "react";
import { getUsers } from "@/lib/users";

async function UserList() {
  const users = await getUsers();

  if (users.length === 0) {
    return <p>No users yet.</p>;
  }

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          <Link href={`/users/${user.username}`}>{user.name}</Link> (
          {user.username})
        </li>
      ))}
    </ul>
  );
}

export default function UsersPage() {
  return (
    <div>
      <h1>Users</h1>
      <Suspense fallback={<p>Loading users...</p>}>
        <UserList />
      </Suspense>
    </div>
  );
}
