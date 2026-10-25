import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";

export async function DELETE() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "This endpoint is not available in production" },
      { status: 403 },
    );
  }

  await db.execute(
    sql`TRUNCATE TABLE reading_list, blogs, users RESTART IDENTITY CASCADE`,
  );

  return new NextResponse(null, { status: 204 });
}
