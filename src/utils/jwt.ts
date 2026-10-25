// src/utils/jwt.ts
import jwt, { SignOptions } from "jsonwebtoken";
import { Role } from "../generated/prisma/client";
import { env } from "../config/env";

export interface TokenPayload {
  userId: string;
  role: Role;
}

export const signToken = (payload: TokenPayload): string =>
  jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"],
  });

export const verifyToken = (token: string): TokenPayload =>
  jwt.verify(token, env.jwtSecret) as TokenPayload;