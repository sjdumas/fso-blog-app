"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { addBlog, incrementLikes } from "@/lib/blogs";

export type BlogFormState = {
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

  await addBlog(title, author, url);

  revalidatePath("/blogs");
  redirect("/blogs");
}

export async function likeBlog(formData: FormData) {
  const id = Number(formData.get("id"));

  await incrementLikes(id);

  revalidatePath(`/blogs/${id}`);
  revalidatePath("/blogs");
}
