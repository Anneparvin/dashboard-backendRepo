// src/modules/submission/submission.service.ts
import { prisma } from "../../config/db";
import { ApiError } from "../../utils/ApiError";
import { CreateSubmissionInput } from "./submission.validation";

const submissionSelect = {
  id: true,
  projectName: true,
  repoUrl: true,
  liveLink: true,
  description: true,
  status: true,
  createdAt: true,
} as const;

const isUniqueViolation = (error: unknown) =>
  typeof error === "object" && error !== null && "code" in error && error.code === "P2002";

export async function createSubmission(studentId: string, input: CreateSubmissionInput) {
  // ১. আগেই duplicate ধরা, নিজের না অন্য student-এর, সেটা বুঝিয়ে বলা
  const existing = await prisma.submission.findUnique({
    where: { repoUrl: input.repoUrl },
    select: { studentId: true },
  });

  if (existing) {
    throw new ApiError(
      409,
      existing.studentId === studentId
        ? "You have already submitted this repository"
        : "This repository has already been submitted by another student"
    );
  }

  // ২. একসাথে দুইটা request এলে database-এর unique constraint শেষ ঢাল
  try {
    return await prisma.submission.create({
      data: {
        projectName: input.projectName,
        repoUrl: input.repoUrl,
        liveLink: input.liveLink,
        description: input.description,
        studentId,
      },
      select: submissionSelect,
    });
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new ApiError(409, "This repository has already been submitted");
    }
    throw error;
  }
}
export async function getMySubmissions(studentId: string) {
  return prisma.submission.findMany({
    where: { studentId },
    orderBy: { createdAt: "desc" },
    select: submissionSelect,
  });
}