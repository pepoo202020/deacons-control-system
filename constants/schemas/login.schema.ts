import { z } from "zod";
import { LOGIN_PAGE_DATA } from "../login.data";

// Create a function that returns the schema with the correct language
export const getLoginSchema = (language: "AR" | "EN") => {
  return z.object({
    email: z
      .string()
      .min(1, {
        message: LOGIN_PAGE_DATA.fieldsErrorMessages.emailRequired[language],
      })
      .email({ message: LOGIN_PAGE_DATA.fieldsErrorMessages.email[language] }),
    password: z.string().min(8, {
      message: LOGIN_PAGE_DATA.fieldsErrorMessages.password[language],
    }),
    stayLogged: z.boolean().optional(),
  });
};
