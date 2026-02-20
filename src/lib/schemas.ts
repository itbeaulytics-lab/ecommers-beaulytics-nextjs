import { z } from "zod";


export const QuestionnaireSchema = z.object({
  answers: z.record(z.string().trim().max(200), z.string().trim().max(200)).default({}),
  aiSummary: z.string().trim().max(2000).optional().default(""),
});

export const ReviewSchema = z.object({
  productId: z.string().trim().min(1).max(128),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().max(2000).optional().default(""),
});
