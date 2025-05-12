import { PrismaClient } from "@/prisma/generated/prisma";
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import * as bcrypt from "bcryptjs";

const db = new PrismaClient();

const handler = NextAuth({
  adapter: PrismaAdapter(db as any) as any,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        stayLogged: { label: "Stay Logged In", type: "boolean" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }
        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) {
          return null;
        }
        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!passwordMatch) {
          return null;
        }
        return {
          id: String(user.id),
          name: user.name ?? "",
          username: user.username ?? "",
          email: user.email ?? "",
          role: user.role,
          avatar: user.picture ?? "",
          stayLogged: credentials?.stayLogged === "true",
        };
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 10 * 24 * 60 * 60 },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.username = user.username;
        token.email = user.email;
        token.role = user.role;
        token.avatar = user.avatar;
        token.stayLogged = user.stayLogged; // Save it into the token
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role;
        const expiresInDays = token.stayLogged ? 30 : 1; // Set the expiration based on stayLogged
        const expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + expiresInDays);
        session.expires = expireDate.toISOString(); // Set the session expiration
      }
      return session;
    },
  },
  pages: { signIn: "/login" },
});

export { handler as GET, handler as POST };
