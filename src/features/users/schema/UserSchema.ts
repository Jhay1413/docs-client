import { userInfo } from "os";
import { z } from "zod";

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  employeeId: z.string().min(1, {
    message: "Employee ID is required",
  }),
  firstName: z.string().min(1, {
    message: "First name is required",
  }),
  lastName: z.string().min(1, {
    message: "Last name is required",
  }),
  middleName: z.nullable(z.string()),

  assignedDivision: z.string().min(1, {
    message: "Division is required",
  }),
  assignedSection: z.nullable(
    z.string().min(1, {
      message: "Section is required",
    })
  ),
  assignedPosition: z.string().min(1, {
    message: "Position is required",
  }),
  dateStarted: z
    .date()
    .or(z.string())
    .refine((val) => val, {
      message: "Date Started is required",
    }),
  jobStatus: z.string({
    message: "Invalid Input",
  }),
  birthDate: z
    .date()
    .or(z.string())
    .refine((val) => val, {
      message: "Birthdate is required",
    }),
  password: z.optional(
    z.string().min(1, {
      message: "Password is required",
    })
  ),
  accountRole: z.string({
    message: "Invalid Input",
  }),
  imageFile: z.optional(
    z
      .any()
      .refine((file) => !file || (!!file && file.size <= 10 * 1024 * 1024), {
        message: "The profile picture must be a maximum of 10MB.",
      })
      .refine(
        (files) => ACCEPTED_IMAGE_TYPES.includes(files?.type),
        "Only .jpg, .jpeg, .png and .webp formats are supported."
      )
  ),
  contactNumber: z.string().min(1, {
    message: "Contact number is required",
  }),
});
export const UserFormSchema = RegisterSchema.omit({
  password: true,
}).extend({
  id: z.optional(z.string()),
  signedUrl: z.optional(z.string()),
});

// export const UsersInfo = RegisterSchema.omit({
//   password: true,
//   imageFile: true,
// }).extend({
//   id: z.string(),
//   signedUrl: z.string(),
//   createdAt: z.date(),
//   updatedAt: z.date(),
//   accountId: z.string(),
//   imageUrl: z.string(),
// });

export const UsersInfo = z.object({
  id: z.string(),
  employeeId: z.string(),
  firstName: z.string(),
  middleName: z.string(),
  lastName: z.string(),
  assignedDivision: z.string(),
  assignedSection: z.nullable(z.string()),
  assignedPosition: z.string(),
  dateStarted: z.string().datetime(),
  jobStatus: z.string(),
  birthDate: z.string().datetime(),
  signedUrl: z.string().optional(),
  email:z.string(),
  contactNumber:z.string()

});

export const AccountSchema = z.object({
  id: z.string(),
  email: z.string(),
  accountRole: z.string(),
  password: z.string(),
  userInfo:z.nullable(UsersInfo).optional()
})
export const UserInfoWithAccount = UsersInfo.extend({
  email: z.string(),
 account :AccountSchema
});

export const UsersArray = z.array(UsersInfo);

export type TUserForm = z.infer<typeof UserFormSchema>;

export type TUserWithAccount = z.infer<typeof UserInfoWithAccount>;
export type TUsers = z.infer<typeof UsersInfo>;
export type TRegister = z.infer<typeof RegisterSchema>;
