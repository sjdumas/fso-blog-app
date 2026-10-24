"use server";

import { revalidatePath } from "next/cache";
import { addBlog, incrementLikes } from "@/lib/blogs";
import { auth } from "@/auth";

export type BlogFormState = {
  success?: boolean;
  error?: string;
  errors?: {
    title?: string;
    author?: string;
    url?: string;
  };
  values?: {
    title: string;
    author: string;
    url: string;
  };
};

function validateField(value: string, label: string): string | undefined {
  if (!value) {
    return `${label} is required.`;
  }

  if (value.length < 5) {
    return `${label} must be at least 5 characters long.`;
  }

  return undefined;
}

export async function createBlog(
  prevState: BlogFormState,
  formData: FormData,
): Promise<BlogFormState> {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "You must be logged in to create a blog." };
  }

  const title = String(formData.get("title") ?? "").trim();
  const author = String(formData.get("author") ?? "").trim();
  const url = String(formData.get("url") ?? "").trim();

  const errors = {
    title: validateField(title, "Title"),
    author: validateField(author, "Author"),
    url: validateField(url, "URL"),
  };

  if (errors.title || errors.author || errors.url) {
    return { errors, values: { title, author, url } };
  }

  await addBlog(title, author, url, Number(session.user.id));

  revalidatePath("/blogs");
  revalidatePath("/me");
  return { success: true, values: { title, author, url } };
}

export async function likeBlog(formData: FormData) {
  const id = Number(formData.get("id"));

  await incrementLikes(id);

  revalidatePath(`/blogs/${id}`);
  revalidatePath("/blogs");
}
