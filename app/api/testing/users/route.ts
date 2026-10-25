import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { addUser, usernameExists } from "@/lib/users";

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "This endpoint is not available in production" },
      { status: 403 },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON" },
      { status: 400 },
    );
  }

  const { username, name, password } = (body ?? {}) as Record<string, unknown>;

  if (
    typeof username !== "string" ||
    typeof name !== "string" ||
    typeof password !== "string" ||
    !username ||
    !name ||
    !password
  ) {
    return NextResponse.json(
      { error: "username, name and password are required" },
      { status: 400 },
    );
  }

  if (await usernameExists(username)) {
    return NextResponse.json(
      { error: "Username is already taken" },
      { status: 409 },
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await addUser(username, name, passwordHash);

  return NextResponse.json(user, { status: 201 });
}
