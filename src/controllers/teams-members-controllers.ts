import { Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { prisma } from "../database/prisma";
import { z } from "zod";


class TeamsMembersController {
  async create(req: Request, res: Response) {
    const { teamId, userId } = z.object({
      teamId: z.string(),
      userId: z.string(),
    }).parse(req.body);

    await prisma.teamMember.create({
      data: {
        teamId,
        userId,
      },
    });

    const [user, team] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { name: true },
      }),
      prisma.team.findUnique({
        where: { id: teamId },
        select: { name: true },
      }),
    ]);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (!team) {
      throw new AppError("Team not found", 404);
    }

    return res.status(201).json({ message: `The user '${user.name}' was added to the team '${team.name}'` });
  }

  async index(req: Request, res: Response) {
    const teamsMembers = await prisma.teamMember.findMany({
      include: {
        team: {
          select: {
            name: true,
            id: true,
          },
        },
        user: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });
    return res.status(200).json(teamsMembers.map((teamMember) => ({
      teamMemberId: teamMember.id,
      team: teamMember.team.name,
      teamId: teamMember.team.id,
      user: teamMember.user.name,
      userId: teamMember.user.id,
    })));
  }

  async update(req: Request, res: Response) {
    const { id } = z.object({
      id: z.string(),
    }).parse(req.params);

    const { teamId } = z.object({
      teamId: z.string(),
    }).parse(req.body);

    try {
      await prisma.teamMember.update({
        where: { id },
        data: { teamId },
      });

      return res.status(200).json({ message: "Team member updated" });
    } catch (error) {
      console.error("Error updating team member:", error);
      return res.status(500).json({ message: "Error updating team member" });
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = z.object({
      id: z.string(),
    }).parse(req.params);

    const teamMember = await prisma.teamMember.findUnique({
      where: { id },
      include: {
        team: {
          select: { name: true },
        },
        user: { select: { name: true } },
      },
    });

    if (!teamMember) {
      throw new AppError("Team member not found", 404);
    }

    await prisma.teamMember.delete({ where: { id } });

    return res.status(200).json({ message: `Team member ${teamMember.user.name} removed from team ${teamMember.team.name}` });
  }
}

export { TeamsMembersController };
