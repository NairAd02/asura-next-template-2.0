"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  loginSchema,
  LoginSchema,
} from "./schemas/login-schema";
import LoginForm from "./login-form";

export default function LoginFormContainer() {
  const [loading, setLoading] = useState(false);

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(_data: LoginSchema) {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    toast.info("Demo mode — authentication is not wired yet.");
    setLoading(false);
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="h-full w-full flex items-center justify-center">
        <LoginForm
          loading={loading}
          error={null}
        />
      </form>
    </FormProvider>
  );
}
