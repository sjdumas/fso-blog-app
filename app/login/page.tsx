import { Suspense } from "react";
import { login } from "@/lib/auth-actions";

interface LoginPageProps {
    searchParams: Promise<{ error?: string | string[] }>;
}

async function LoginError({ searchParams }: LoginPageProps) {
    const { error } = await searchParams;

    if (!error) {
        return null;
    }

    return <p style={{ color: "red" }}>Invalid username or password.</p>;
}

export default function LoginPage({ searchParams }: LoginPageProps) {
    return (
        <div>
            <h1>Log in</h1>
            <Suspense fallback={null}>
                <LoginError searchParams={searchParams} />
            </Suspense>
            <form action={login}>
                <div>
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        autoComplete="username"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                    />
                </div>
                <button type="submit">Log in</button>
            </form>
        </div>
    );
}
