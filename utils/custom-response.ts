import { ResponseIF } from "@/types/response";

export const customResponse = ({
  success,
  title,
  message,
  data,
  error,
}: ResponseIF) => {
  return { success, title, message, data, error };
};
