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

export const QuestionnaireSchema = z.object({
  answers: z.record(z.string().trim().max(200), z.string().trim().max(200)).default({}),
  aiSummary: z.string().trim().max(2000).optional().default(""),
});

export const ReviewSchema = z.object({
  productId: z.string().trim().min(1).max(128),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().max(2000).optional().default(""),
});
