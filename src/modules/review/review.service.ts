// src/modules/review/review.service.ts
import { prisma } from "../../config/db";
import { ApiError } from "../../utils/ApiError";
import { ListSubmissionsQuery, ReviewDecision } from "./review.validation";

const reviewSelect = {
  id: true,
  projectName: true,
  repoUrl: true,
  liveLink: true,
  description: true,
  status: true,
  createdAt: true,
  student: { select: { id: true, name: true, email: true } },
} as const;

export async function listSubmissions({ page, limit, status }: ListSubmissionsQuery) {
  const where = status ? { status } : undefined;

  // দুইটাই শুধু read, তাই transaction ছাড়া একসাথে চালানো যথেষ্ট
  const [items, total] = await Promise.all([
    prisma.submission.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      select: reviewSelect,
    }),
    prisma.submission.count({ where }),
  ]);

  return {
    items,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export async function reviewSubmission(id: string, status: ReviewDecision) {
  // শুধু PENDING থাকলেই update হবে। দুইজন mentor একসাথে চাপলেও একজনেরটাই কাজ করবে
  const result = await prisma.submission.updateMany({
    where: { id, status: "PENDING" },
    data: { status },
  });

  if (result.count === 0) {
    const existing = await prisma.submission.findUnique({
      where: { id },
      select: { status: true },
    });
    if (!existing) {
      throw new ApiError(404, "Submission not found");
    }
    throw new ApiError(409, `Submission is already ${existing.status.toLowerCase()}`);
  }

  return prisma.submission.findUniqueOrThrow({ where: { id }, select: reviewSelect });
}

export async function getStats() {
  const groups = await prisma.submission.groupBy({
    by: ["status"],
    _count: { _all: true },
  });

  const stats = { total: 0, pending: 0, approved: 0, rejected: 0 };

  for (const group of groups) {
    const key = group.status.toLowerCase() as "pending" | "approved" | "rejected";
    stats[key] = group._count._all;
    stats.total += group._count._all;
  }

  return stats;
}