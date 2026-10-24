import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { blogs, users } from "@/db/schema";

export type User = Pick<typeof users.$inferSelect, "id" | "username" | "name">;

const publicUserColumns = { id: true, username: true, name: true } as const;

export async function getUsers(): Promise<User[]> {
  return db
    .select({ id: users.id, username: users.username, name: users.name })
    .from(users)
    .orderBy(asc(users.name));
}

export async function getUserByUsername(username: string) {
  return db.query.users.findFirst({
    where: eq(users.username, username),
    columns: publicUserColumns,
    with: {
      blogs: {
        orderBy: [desc(blogs.likes)],
      },
    },
  });
}

export async function getUserWithPasswordHash(username: string) {
  return db.query.users.findFirst({
    where: eq(users.username, username),
  });
}

export async function getUserWithToken(id: number) {
  if (!Number.isInteger(id)) {
    return undefined;
  }

  return db.query.users.findFirst({
    where: eq(users.id, id),
    columns: { ...publicUserColumns, token: true },
  });
}

export async function setUserToken(id: number, token: string): Promise<void> {
  await db.update(users).set({ token }).where(eq(users.id, id));
}

export async function usernameExists(username: string): Promise<boolean> {
  const result = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.username, username));

  return result.length > 0;
}

export async function addUser(
  username: string,
  name: string,
  passwordHash: string,
): Promise<User> {
  const result = await db
    .insert(users)
    .values({ username, name, passwordHash })
    .returning({ id: users.id, username: users.username, name: users.name });

  return result[0];
}
