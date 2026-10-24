"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { setUserToken } from "@/lib/users";

export async function generateToken() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const token = crypto.randomUUID();
  await setUserToken(Number(session.user.id), token);

  revalidatePath("/me");
}
