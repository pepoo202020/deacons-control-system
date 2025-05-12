"use client";

import { getLoginSchema } from "@/constants/schemas/login.schema";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { LOGIN_PAGE_DATA } from "@/constants/login.data";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { useState } from "react";
import { login } from "@/actions/auth.actions";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { clientLogin } from "@/lib/auth";

interface LoginFormProps {
  isRTL: boolean;
  language?: "AR" | "EN";
}

export const LoginForm = ({ isRTL, language = "AR" }: LoginFormProps) => {
  const router = useRouter();
  const loginSchema = getLoginSchema(language);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      stayLogged: false,
    },
  });
  async function handleSubmit(data: z.infer<typeof loginSchema>) {
    try {
      setIsLoading(true);

      // First, validate on the server
      const serverResult = await login(data, language);

      if (serverResult.success) {
        // If server validation passes, perform client-side login
        const clientResult = await clientLogin(
          data.email,
          data.password,
          data.stayLogged
        );

        if (clientResult?.ok) {
          toast.success(LOGIN_PAGE_DATA.response.success.message[language]);
          router.push("/dashboard");
          router.refresh();
        } else {
          toast.error(LOGIN_PAGE_DATA.response.error.unknown.message[language]);
        }
      } else {
        toast.error(serverResult.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(LOGIN_PAGE_DATA.response.error.unknown.message[language]);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <Card className="w-full max-w-xl shadow-2xl">
      <CardHeader className={`text-${isRTL ? "right" : "left"}`}>
        <CardTitle className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {LOGIN_PAGE_DATA.welcome[language]}
        </CardTitle>
        <CardDescription className="mt-2 text-gray-600 dark:text-gray-400">
          {LOGIN_PAGE_DATA.welcomeP[language]}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {LOGIN_PAGE_DATA.formFields.labels.email[language]}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder={
                        LOGIN_PAGE_DATA.formFields.placeholders.email[language]
                      }
                      {...field}
                      className={`global-input ${
                        form.formState.errors.email
                          ? "border-red-500 focus:border-red-500 focus-visible:ring-red-500"
                          : ""
                      }`}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600 font-bold text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {LOGIN_PAGE_DATA.formFields.labels.password[language]}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={
                        LOGIN_PAGE_DATA.formFields.placeholders.password[
                          language
                        ]
                      }
                      {...field}
                      className={`global-input ${
                        form.formState.errors.password
                          ? "border-red-500 focus:border-red-500 focus-visible:ring-red-500"
                          : ""
                      }`}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600 font-bold text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stayLogged"
              render={({ field }) => (
                <FormItem
                  className={`flex items-center flex-row-reverse justify-end`}
                >
                  <FormLabel>
                    {LOGIN_PAGE_DATA.formFields.labels.stayLogged[language]}
                  </FormLabel>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600 font-bold text-xs" />
                </FormItem>
              )}
            />
            <Button
              disabled={isLoading}
              className="global-submit-btn text-xl"
              type="submit"
            >
              {isLoading
                ? LOGIN_PAGE_DATA.buttons.loading[language]
                : LOGIN_PAGE_DATA.buttons.login[language]}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
