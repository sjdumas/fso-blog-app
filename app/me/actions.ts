"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { markEntryAsRead } from "@/lib/readingList";
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

export async function markAsRead(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  await markEntryAsRead(
    Number(session.user.id),
    Number(formData.get("entryId")),
  );

  revalidatePath("/me");
}
