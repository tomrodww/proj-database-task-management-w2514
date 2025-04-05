import { Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { prisma } from "../database/prisma";
import { authConfig } from "../configs/auth";
import { sign } from "jsonwebtoken";
import { z } from "zod";
import bcrypt from "bcrypt";

class TeamsController {
  async create(req: Request, res: Response) {
    const { name, description } = z.object({
      name: z.string(),
      description: z.string(),
    }).parse(req.body);

    await prisma.team.create({
      data: {
        name,
        description,
      },
    });

    return res.status(201).json({ message: `The team '${name}' was created` });
  }

  async index(req: Request, res: Response) {
    const teams = await prisma.team.findMany();
    const teamsWithMembers = await Promise.all(teams.map(async (team) => {
      const members = await prisma.teamMember.findMany({
        where: { teamId: team.id },
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      });
      return { ...team, members: members.map((member) => member.user.name) };
    }));
    return res.status(200).json(teamsWithMembers);
  }

  async update(req: Request, res: Response) {
    const { id } = z.object({
      id: z.string(),
    }).parse(req.params);

    const { name, description } = z.object({
      name: z.string(),
      description: z.string(),
    }).parse(req.body);

    const team = await prisma.team.findUnique({
      where: { id },
      select: {
        name: true,
        description: true,
      },
    });

    if (!team) {
      throw new AppError("Team not found", 404);
    }

    await prisma.team.update({
      where: { id },
      data: { name, description },
    });

    return res.status(200).json({ message: `Team updated` });
  }

  async delete(req: Request, res: Response) {
    const { id } = z.object({
      id: z.string(),
    }).parse(req.params);

    // Find the team to ensure it exists
    const team = await prisma.team.findUnique({
      where: { id },
    });

    if (!team) {
      throw new AppError("Team not found", 404);
    }

    // Delete associated team members
    await prisma.teamMember.deleteMany({
      where: { teamId: id }, // Delete all members associated with the team
    });

    // Now delete the team
    await prisma.team.delete({ where: { id } });

    return res.status(200).json({ message: `Team and its members deleted` });
  }
}

export { TeamsController };
