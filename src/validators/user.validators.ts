import z from "zod";

export const userUUIDSchema = z.uuid("User ID must be valid");

export const userSchema = z.object({
  email: z.email("Email must be a valid email address"),
  firstName: z
    .string({ error: "First name is required" })
    .min(1, "First name cannot be empty")
    .max(100),
  lastName: z
    .string({ error: "Last name is required" })
    .min(1, "Last name cannot be empty")
    .max(100),
});

export const userIDSchema = z.object({
  userId: userUUIDSchema,
});

export const updateUserSchema = userSchema.partial();

export const updateUserRequestSchema = updateUserSchema.extend(
  userIDSchema.shape
);

export const getAllUsersSchema = z.object({
  cursor: z.uuid().optional(),
  pagesize: z
    .string()
    .refine(
      (val) => {
        const num = Number(val);
        return !isNaN(num) && num > 0 && num <= 50;
      },
      { message: "Page size must be a number between 1 and 50" }
    )
    .transform(Number)
    .optional(),
});
