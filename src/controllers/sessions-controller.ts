import { Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { prisma } from "../database/prisma";
import { authConfig } from "../configs/auth";
import { sign } from "jsonwebtoken";
import { z } from "zod";
import bcrypt from "bcrypt";

class SessionsController {
  async create(req: Request, res: Response) {
    const { email, password } = z.object({
      email: z.string().email(),
      password: z.string().min(8),
    }).parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new AppError("Invalid credentials", 401);
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({ role: user.role }, secret, {
      subject: user.id,
      expiresIn: "1d",
    });

    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json({ user: userWithoutPassword, token, expiresIn });
  }
  
  async index(req: Request, res: Response) {
    return res.status(200).json({ message: "list sessions" });
  }

  async delete(req: Request, res: Response) {
    return res.status(200).json({ message: "session Logout done!" });
  }
}

export { SessionsController };