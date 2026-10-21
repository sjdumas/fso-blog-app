"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn, signOut } from "@/auth";

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
