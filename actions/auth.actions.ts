"use server";

import { LOGIN_PAGE_DATA } from "@/constants/login.data";
import { getLoginSchema } from "@/constants/schemas/login.schema";
import { customResponse } from "@/utils/custom-response";
import { z } from "zod";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@/prisma/generated/prisma";

const prisma = new PrismaClient();

export async function login(
  formData: z.infer<ReturnType<typeof getLoginSchema>>,
  language: "AR" | "EN" = "AR"
) {
  const loginSchema = getLoginSchema(language);
  try {
    // validating form data
    const validatedFields = loginSchema.safeParse(formData);
    if (!validatedFields.success) {
      return customResponse({
        success: false,
        title: LOGIN_PAGE_DATA.response.error.invalidFields.title[language],
        message: LOGIN_PAGE_DATA.response.error.invalidFields.message[language],
      });
    }

    const { email, password, stayLogged } = validatedFields.data;

    // Find the user in the database
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return customResponse({
        success: false,
        title: LOGIN_PAGE_DATA.response.error.userNotFound.title[language],
        message: LOGIN_PAGE_DATA.response.error.userNotFound.message[language],
      });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return customResponse({
        success: false,
        title: LOGIN_PAGE_DATA.response.error.passwordError.title[language],
        message: LOGIN_PAGE_DATA.response.error.passwordError.message[language],
      });
    }

    // Return success
    return customResponse({
      success: true,
      title: LOGIN_PAGE_DATA.response.success.title[language],
      message: LOGIN_PAGE_DATA.response.success.message[language],
    });
  } catch (error) {
    console.error("Error in login:", error);
    return customResponse({
      success: false,
      title: LOGIN_PAGE_DATA.response.error.unknown.title[language],
      message: LOGIN_PAGE_DATA.response.error.unknown.message[language],
    });
  }
}

export async function logout() {
  // Server-side logout logic if needed
  // For client-side logout, use the signOut function from next-auth/react in a client component
}

export async function checkUserAvailability() {
  try {
    const session = await getServerSession();
    if (!session || !session.user) {
      return { isLoggedIn: false, user: null };
    }
    return {
      isLoggedIn: true, // Fixed typo from "iseLoggedIn" to "isLoggedIn"
      user: {
        id: session.user.id,
        name: session.user.name,
        username: session.user.username,
        email: session.user.email,
        role: session.user.role,
        image: session.user.image,
      },
    };
  } catch (error) {
    console.error("Error checking user availability:", error);
    return { isLoggedIn: false, user: null };
  }
}
