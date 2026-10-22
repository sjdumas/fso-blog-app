"use client";

import { useActionState } from "react";
import { registerUser, type RegisterFormState } from "@/lib/auth-actions";

const initialState: RegisterFormState = {};

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState(
    registerUser,
    initialState,
  );

  return (
    <form action={formAction} noValidate>
      <div>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          defaultValue={state.values?.username}
        />
        {state.errors?.username && (
          <p style={{ color: "red" }}>{state.errors.username}</p>
        )}
      </div>
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          defaultValue={state.values?.name}
        />
        {state.errors?.name && (
          <p style={{ color: "red" }}>{state.errors.name}</p>
        )}
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
        />
        {state.errors?.password && (
          <p style={{ color: "red" }}>{state.errors.password}</p>
        )}
      </div>
      <div>
        <label htmlFor="passwordConfirm">Confirm password</label>
        <input
          id="passwordConfirm"
          name="passwordConfirm"
          type="password"
          autoComplete="new-password"
        />
        {state.errors?.passwordConfirm && (
          <p style={{ color: "red" }}>{state.errors.passwordConfirm}</p>
        )}
      </div>
      <button type="submit" disabled={isPending}>
        {isPending ? "Registering..." : "Register"}
      </button>
    </form>
  );
}
