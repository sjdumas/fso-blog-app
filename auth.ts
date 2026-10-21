import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getUserWithPasswordHash } from "@/lib/users";

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                username: { label: "Username" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                const { username, password } = credentials;

                if (typeof username !== "string" || typeof password !== "string") {
                    return null;
                }

                const user = await getUserWithPasswordHash(username);

                if (!user || !user.passwordHash) {
                    return null;
                }

                const passwordCorrect = await bcrypt.compare(
                    password,
                    user.passwordHash,
                );

                if (!passwordCorrect) {
                    return null;
                }

                return { id: String(user.id), name: user.name };
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        session({ session, token }) {
            if (token.sub) {
                session.user.id = token.sub;
            }

            return session;
        },
    },
});
