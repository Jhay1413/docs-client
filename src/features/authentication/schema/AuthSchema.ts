import { z } from "zod";

export const AccountSchema = z.object({
    email: z.string(),
    accountRole: z.enum(["ADMIN", "SUPERADMIN", "USER"], {
      message: "Invalid Input",
    }),
    password: z.string().min(1, {
      message: "Password is required",
    }),
    id: z.string(),
  });
  export const loginUserSchema = AccountSchema.omit({
    id: true,
    accountRole: true,
  });
export type TAccount = z.infer<typeof AccountSchema>;
export type TLogin = z.infer<typeof loginUserSchema>;