import { getUserByToken } from "@/lib/users";

function unauthorized() {
  return Response.json(
    { error: "Invalid or missing API token." },
    {
      status: 401,
      headers: { "WWW-Authenticate": "Bearer" },
    },
  );
}

export async function GET(request: Request) {
  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return unauthorized();
  }

  const token = authorization.slice("Bearer ".length).trim();

  if (!token) {
    return unauthorized();
  }

  const user = await getUserByToken(token);

  if (!user) {
    return unauthorized();
  }

  return Response.json(user);
}
