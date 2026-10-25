// src/modules/submission/submission.controller.ts
import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import * as submissionService from "./submission.service";

export const create = asyncHandler(async (req: Request, res: Response) => {
  const data = await submissionService.createSubmission(req.user!.id, req.body);
  res.status(201).json({ success: true, message: "Project submitted successfully", data });
});

export const getMine = asyncHandler(async (req: Request, res: Response) => {
  const data = await submissionService.getMySubmissions(req.user!.id);
  res.status(200).json({ success: true, data });
});