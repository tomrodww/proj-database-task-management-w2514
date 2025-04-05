import { Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { prisma } from "../database/prisma";
import { z } from "zod";
import bcrypt from "bcrypt";

class UsersController {
  async create(req: Request, res: Response) {
    const { name, email, password } = z.object({
      name: z.string().trim().min(2),
      email: z.string().trim().email(),
      password: z.string().trim().min(8),
    }).parse(req.body);

    const userWithSameEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (userWithSameEmail) {
      throw new AppError("User with same email already exists", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 8)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const { password: _, ...userWithoutPassword } = user;

    return res.status(201).json({ message: `user ${name} created with hash: ${hashedPassword}` });
  }

  async index(req: Request, res: Response) {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(200).json(users);
  }
}

export { UsersController };
