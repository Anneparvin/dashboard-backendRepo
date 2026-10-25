// src/modules/submission/submission.routes.ts
import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { submissionLimiter } from "../../middlewares/rateLimit.middleware";
import { validateBody } from "../../middlewares/validate.middleware";
import * as submissionController from "./submission.controller";
import { createSubmissionSchema } from "./submission.validation";

const router = Router();

router.use(authenticate, authorize("STUDENT"));

router.post(
  "/",
  submissionLimiter,
  validateBody(createSubmissionSchema),
  submissionController.create
);
router.get("/my", submissionController.getMine);

export default router;