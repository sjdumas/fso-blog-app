"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { signIn, signOut } from "@/auth";
import { addUser, usernameExists } from "@/lib/users";

export type LoginFormState = {
  success?: boolean;
  error?: string;
  values?: {
    username: string;
  };
};

export async function login(
  prevState: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const failure = {
    error: "Invalid username or password.",
    values: { username },
  };

  try {
    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (typeof result === "string" && result.includes("error=")) {
      return failure;
    }
  } catch (error) {
    if (error instanceof AuthError) {
      return failure;
    }

    throw error;
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function logout() {
  await signOut({ redirectTo: "/" });
}

export type RegisterFormState = {
  success?: boolean;
  errors?: {
    username?: string;
    name?: string;
    password?: string;
    passwordConfirm?: string;
  };
  values?: {
    username: string;
    name: string;
  };
};

export async function registerUser(
  prevState: RegisterFormState,
  formData: FormData,
): Promise<RegisterFormState> {
  const username = String(formData.get("username") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const passwordConfirm = String(formData.get("passwordConfirm") ?? "");

  const errors: NonNullable<RegisterFormState["errors"]> = {};

  if (!username) {
    errors.username = "Username is required.";
  } else if (username.length < 4) {
    errors.username = "Username must be at least 4 characters long.";
  } else if (await usernameExists(username)) {
    errors.username = "That username is already taken.";
  }

  if (!name) {
    errors.name = "Name is required.";
  }

  if (!password) {
    errors.password = "Password is required.";
  } else if (password.length < 4) {
    errors.password = "Password must be at least 4 characters long.";
  }

  if (password !== passwordConfirm) {
    errors.passwordConfirm = "Passwords do not match.";
  }

  if (Object.keys(errors).length > 0) {
    return { errors, values: { username, name } };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await addUser(username, name, passwordHash);

  revalidatePath("/users");
  return { success: true };
}
