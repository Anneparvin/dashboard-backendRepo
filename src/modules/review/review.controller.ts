// src/modules/review/review.controller.ts
import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import * as reviewService from "./review.service";
import { ListSubmissionsQuery } from "./review.validation";

export const list = asyncHandler(async (_req: Request, res: Response) => {
  const query = res.locals.query as ListSubmissionsQuery;
  const { items, meta } = await reviewService.listSubmissions(query);
  res.status(200).json({ success: true, data: items, meta });
});

export const review = asyncHandler(async (req: Request, res: Response) => {
  const { id } = res.locals.params as { id: string };
  const data = await reviewService.reviewSubmission(id, req.body.status);
  res.status(200).json({
    success: true,
    message: `Submission ${data.status.toLowerCase()} successfully`,
    data,
  });
});

export const stats = asyncHandler(async (_req: Request, res: Response) => {
  const data = await reviewService.getStats();
  res.status(200).json({ success: true, data });
});