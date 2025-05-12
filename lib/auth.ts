"use client";

import { signIn, signOut } from "next-auth/react";

export async function clientLogin(
  email: string,
  password: string,
  stayLogged?: boolean
) {
  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      stayLogged,
    });

    return result;
  } catch (error) {
    console.error("Error in client login:", error);
    throw error;
  }
}

export async function clientLogout() {
  await signOut();
}
