import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { readingList } from "@/db/schema";

export async function addToReadingList(
  userId: number,
  blogId: number,
): Promise<void> {
  await db
    .insert(readingList)
    .values({ userId, blogId })
    .onConflictDoNothing();
}

export async function isOnReadingList(
  userId: number,
  blogId: number,
): Promise<boolean> {
  const result = await db
    .select({ id: readingList.id })
    .from(readingList)
    .where(and(eq(readingList.userId, userId), eq(readingList.blogId, blogId)));

  return result.length > 0;
}

export async function getReadingList(userId: number) {
  return db.query.readingList.findMany({
    where: eq(readingList.userId, userId),
    orderBy: [desc(readingList.id)],
    with: {
      blog: true,
    },
  });
}

export async function markEntryAsRead(
  userId: number,
  entryId: number,
): Promise<void> {
  if (!Number.isInteger(entryId)) {
    return;
  }

  await db
    .update(readingList)
    .set({ read: true })
    .where(and(eq(readingList.id, entryId), eq(readingList.userId, userId)));
}
