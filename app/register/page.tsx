import { Suspense } from "react";
import { registerUser } from "@/lib/auth-actions";

interface RegisterPageProps {
  searchParams: Promise<{ error?: string | string[] }>;
}

const errorMessages: Record<string, string> = {
  missing: "Please fill in all fields.",
  "too short":
    "Username must be at least 3 characters and password at least 8 characters.",
  taken: "That username is already taken.",
};

async function RegisterError({ searchParams }: RegisterPageProps) {
  const { error } = await searchParams;
  const message = typeof error === "string" ? errorMessages[error] : undefined;

  if (!message) {
    return null;
  }

  return <p style={{ color: "red" }}>{message}</p>;
}

export default function RegisterPage({ searchParams }: RegisterPageProps) {
  return (
    <div>
      <h1>Register</h1>
      <Suspense fallback={null}>
        <RegisterError searchParams={searchParams} />
      </Suspense>
      <form action={registerUser}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            minLength={3}
            required
          />
        </div>
        <div>
          <label htmlFor="name">Name</label>
          <input id="name" name="name" type="text" autoComplete="name" required />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
