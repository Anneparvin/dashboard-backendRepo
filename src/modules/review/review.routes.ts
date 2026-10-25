// src/modules/review/review.routes.ts
import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middlewares/validate.middleware";
import * as reviewController from "./review.controller";
import {
  listSubmissionsQuerySchema,
  reviewDecisionSchema,
  submissionIdParamSchema,
} from "./review.validation";

const router = Router();

// এই module-এর সব route শুধু MENTOR আর ADMIN-এর জন্য
router.use(authenticate, authorize("MENTOR", "ADMIN"));

router.get("/stats", reviewController.stats);

router.get(
  "/submissions",
  validateQuery(listSubmissionsQuerySchema),
  reviewController.list
);

router.patch(
  "/submissions/:id/status",
  validateParams(submissionIdParamSchema),
  validateBody(reviewDecisionSchema),
  reviewController.review
);

export default router;