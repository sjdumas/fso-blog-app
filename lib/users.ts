import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { blogs, users } from "@/db/schema";

export type User = Omit<typeof users.$inferSelect, "passwordHash">;

export async function getUsers(): Promise<User[]> {
    return db
        .select({ id: users.id, username: users.username, name: users.name })
        .from(users)
        .orderBy(asc(users.name));
}

export async function getUserByUsername(username: string) {
    return db.query.users.findFirst({
        where: eq(users.username, username),
        columns: { passwordHash: false },
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
