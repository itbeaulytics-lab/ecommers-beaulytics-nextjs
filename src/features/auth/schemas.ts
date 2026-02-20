import { z } from "zod";

const emailSchema = z.string().trim().email().max(255);
const passwordSchema = z.string().trim().min(6).max(200);
const nameSchema = z.string().trim().min(1).max(120);

export const LoginSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
    next: z.string().trim().max(512).optional(),
});

export const RegisterSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
    full_name: nameSchema,
    next: z.string().trim().max(512).optional(),
});
