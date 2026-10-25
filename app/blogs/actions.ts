"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { addBlog, getBlogById, incrementLikes } from "@/lib/blogs";
import { addToReadingList } from "@/lib/readingList";

export type BlogFormState = {
  success?: boolean;
  error?: string;
  created?: {
    title: string;
    author: string;
  };
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
  return { success: true, created: { title, author } };
}

export async function likeBlog(formData: FormData) {
  const id = Number(formData.get("id"));

  await incrementLikes(id);

  revalidatePath(`/blogs/${id}`);
  revalidatePath("/blogs");
}

export async function saveToReadingList(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const blog = await getBlogById(Number(formData.get("blogId")));

  if (!blog) {
    return;
  }

  await addToReadingList(Number(session.user.id), blog.id);

  revalidatePath(`/blogs/${blog.id}`);
  revalidatePath("/me");
}
