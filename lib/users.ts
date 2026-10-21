import { asc } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";

export type User = typeof users.$inferSelect;

export async function getUsers(): Promise<User[]> {
    return db.select().from(users).orderBy(asc(users.name));
}
