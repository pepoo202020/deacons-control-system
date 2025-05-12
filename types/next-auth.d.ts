import { UserRole } from "@/prisma/generated/prisma";
import "next-auth";
declare module "next-auth" {
  interface User {
    id: string;
    role: UserRole;
    stayLogged: boolean;
    username: string;
    avatar: string;
  }
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: UserRole;
      username?: string | null;
      stayLogged: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
  }
}
