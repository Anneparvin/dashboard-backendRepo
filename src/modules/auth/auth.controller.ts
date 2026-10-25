// src/modules/auth/auth.controller.ts
import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import * as authService from "./auth.service";

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const data = await authService.signup(req.body);
  res.status(201).json({ success: true, message: "Signup successful", data });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const data = await authService.login(req.body);
  res.status(200).json({ success: true, message: "Login successful", data });
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const data = await authService.getMe(req.user!.id);
  res.status(200).json({ success: true, data });
});