// src/modules/auth/auth.routes.ts
import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { validateBody } from "../../middlewares/validate.middleware";
import * as authController from "./auth.controller";
import { loginSchema, signupSchema } from "./auth.validation";
import { authLimiter } from "../../middlewares/rateLimit.middleware";


const router = Router();

// router.post("/signup", validateBody(signupSchema), authController.signup);
// router.post("/login", validateBody(loginSchema), authController.login);
router.get("/me", authenticate, authController.getMe);
router.post("/signup", authLimiter, validateBody(signupSchema), authController.signup);
router.post("/login", authLimiter, validateBody(loginSchema), authController.login);

export default router;