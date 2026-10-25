// src/modules/submission/submission.validation.ts
import { z } from "zod";
import { isValidRepoUrl, normalizeRepoUrl } from "../../utils/url";

// খালি string এলে undefined ধরা হবে (optional field)
const optionalHttpUrl = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z
    .string()
    .trim()
    .url("Live link must be a valid URL")
    .refine((v) => /^https?:\/\//i.test(v), "Live link must start with http:// or https://")
    .optional()
);

export const createSubmissionSchema = z.object({
  projectName: z
    .string()
    .trim()
    .min(3, "Project name must be at least 3 characters")
    .max(100, "Project name must be at most 100 characters"),

  repoUrl: z
    .string()
    .trim()
    .url("Invalid repository URL")
    .refine(isValidRepoUrl, "Repo URL must be a GitHub, GitLab or Bitbucket repository link")
    .transform(normalizeRepoUrl),

  liveLink: optionalHttpUrl,

  description: z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters")
    .max(1000, "Description must be at most 1000 characters"),
});

export type CreateSubmissionInput = z.infer<typeof createSubmissionSchema>;