// src/modules/review/review.validation.ts
import { z } from "zod";

// ফ্রন্টএন্ডে "All" বা খালি filter এলে status ছাড়াই সব দেখাবে
const statusFilter = z.preprocess(
  (value) => (value === "" || value === "ALL" ? undefined : value),
  z.enum(["PENDING", "APPROVED", "REJECTED"]).optional()
);

export const listSubmissionsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  status: statusFilter,
});

export const submissionIdParamSchema = z.object({
  id: z.string().uuid("Invalid submission id"),
});

// Mentor শুধু Approve বা Reject করতে পারবে
export const reviewDecisionSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"], {
    message: "Status must be APPROVED or REJECTED",
  }),
});

export type ListSubmissionsQuery = z.infer<typeof listSubmissionsQuerySchema>;
export type ReviewDecision = z.infer<typeof reviewDecisionSchema>["status"];