"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signIn, signOut } from "@/auth";
import { addUser, usernameExists } from "@/lib/users";

export async function login(formData: FormData) {
  try {
    await signIn("credentials", {
      username: formData.get("username"),
      password: formData.get("password"),
      redirectTo: "/blogs",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect("/login?error=invalid");
    }

    throw error;
  }
}

export async function logout() {
  await signOut({ redirectTo: "/" });
}

export async function registerUser(formData: FormData) {
  const username = String(formData.get("username") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!username || !name || !password) {
    redirect("/register?error=missing");
  }

  if (username.length < 3 || password.length < 8) {
    redirect("/register?error=too-short");
  }

  if (await usernameExists(username)) {
    redirect("/register?error=taken");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await addUser(username, name, passwordHash);

  revalidatePath("/users");
  redirect("/login");
}
