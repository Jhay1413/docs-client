
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { TLogin, loginUserSchema } from "../schema/AuthSchema";
import { loginUser } from "../services/AuthService";

export const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const form = useForm<TLogin>({
    resolver: zodResolver(loginUserSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const mutate = useMutation({
    mutationFn: loginUser,
    onMutate: () => setIsLoading(true),
    onSuccess: async (data) => {
      console.log(data?.data);
      setIsLoading(false);
    
      localStorage.setItem("userinfo", JSON.stringify(data?.data));
      navigate("/dashboard/overview");
    },
    onError: async () => setIsLoading(false),
  });
  const onSubmit: SubmitHandler<TLogin> = (data) => {
    mutate.mutate(data);
  };
  return (
    <div className="flex flex-col w-full ">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="password" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" disabled = {isLoading}>{isLoading ? "Loading" : "Login"}</Button>
        </form>
      </Form>
    </div>
  );
};
