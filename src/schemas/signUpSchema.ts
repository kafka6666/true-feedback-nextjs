import { z } from "zod";

const usernameValidation = z
.string()
.min(3, "Username must be at least 3 characters long")
.max(30, "Username must be at most 30 characters long")
.regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores");

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: "Please enter a valid email address"}),
    password: z.string().min(6, {message: "Password must be at least 6 characters long"}),
});