// src/modules/auth/auth.service.ts
import bcrypt from "bcryptjs";
import { prisma } from "../../config/db";
import { ApiError } from "../../utils/ApiError";
import { signToken } from "../../utils/jwt";
import { LoginInput, SignupInput } from "./auth.validation";

const userSelect = { id: true, name: true, email: true, role: true } as const;

export async function signup(input: SignupInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw new ApiError(409, "Email already registered");
  }

  const hashedPassword = await bcrypt.hash(input.password, 12);

  // role সবসময় STUDENT, client থেকে role নেওয়া হয় না (security)
  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      password: hashedPassword,
      role: "STUDENT",
    },
    select: userSelect,
  });

  const token = signToken({ userId: user.id, role: user.role });
  return { user, token };
}

export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });

  // email ভুল না password ভুল, সেটা আলাদা করে বলা হয় না (security)
  const isValid = user && (await bcrypt.compare(input.password, user.password));
  if (!user || !isValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = signToken({ userId: user.id, role: user.role });
  return {
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    token,
  };
}

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: userSelect });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return user;
}