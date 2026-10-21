import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { blogs, users } from "@/db/schema";

export type User = typeof users.$inferSelect;

export async function getUsers(): Promise<User[]> {
    return db.select().from(users).orderBy(asc(users.name));
}

export async function getUserByUsername(username: string) {
    return db.query.users.findFirst({
        where: eq(users.username, username),
        with: {
            blogs: {
                orderBy: [desc(blogs.likes)],
            },
        },
    });
}
