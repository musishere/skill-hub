import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  fullName: z.string().min(2),
  password: z.string().min(6),
  role: z.enum(["admin", "instructor", "student"]),
  avatarUrl: z.string().url().optional(),
  learnworldsUser: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
