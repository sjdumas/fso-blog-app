import { desc, eq, ilike, sql } from "drizzle-orm";
import { db } from "@/db";
import { blogs } from "@/db/schema";
import { addToReadingList } from "@/lib/readingList";

export type Blog = typeof blogs.$inferSelect;

export async function getBlogs(filter = ""): Promise<Blog[]> {
  return db
    .select()
    .from(blogs)
    .where(ilike(blogs.title, `%${filter}%`))
    .orderBy(desc(blogs.likes));
}

export async function getBlogById(id: number): Promise<Blog | undefined> {
  if (!Number.isInteger(id)) {
    return undefined;
  }

  const result = await db.select().from(blogs).where(eq(blogs.id, id));
    
  return result[0];
}

export async function addBlog(
  title: string,
  author: string,
  url: string,
  userId: number,
): Promise<Blog> {
  const result = await db
    .insert(blogs)
    .values({ title, author, url, userId })
    .returning();

  const newBlog = result[0];
  await addToReadingList(userId, newBlog.id);

  return newBlog;
}

export async function incrementLikes(id: number): Promise<Blog | undefined> {
  if (!Number.isInteger(id)) {
    return undefined;
  }

  const result = await db
    .update(blogs)
    .set({ likes: sql`${blogs.likes} + 1` })
    .where(eq(blogs.id, id))
    .returning();

  return result[0];
}
