"use client";

import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { useNotification } from "@/components/NotificationContext";
import { login, type LoginFormState } from "@/lib/auth-actions";

const initialState: LoginFormState = {};

export default function LoginForm() {
  const router = useRouter();
  const { showNotification } = useNotification();

  const [state, formAction, isPending] = useActionState(
    async (prevState: LoginFormState, formData: FormData) => {
      const result = await login(prevState, formData);

      if (result.success) {
        showNotification("Welcome back! You are now logged in.");
        router.push("/");
      }

      return result;
    },
    initialState,
  );

  return (
    <form action={formAction} noValidate>
      {state.error && (
        <p data-testid="error-message" role="alert" style={{ color: "red" }}>
          {state.error}
        </p>
      )}
      <div>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          defaultValue={state.values?.username}
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
        />
      </div>
      <button type="submit" data-testid="login-button" disabled={isPending}>
        {isPending ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
