import { Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { prisma } from "../database/prisma";
import { z } from "zod";
import { TaskPriority, TaskStatus } from "@prisma/client";

class TasksController {
  async create(req: Request, res: Response) {
    const { title, description, assignee_to, team_id, status, priority } = z.object({
      title: z.string(),
      description: z.string(),
      assignee_to: z.string(),
      team_id: z.string(),
      status: z.nativeEnum(TaskStatus).optional(),
      priority: z.nativeEnum(TaskPriority).optional(),
    }).parse(req.body);

    const finalStatus = status || TaskStatus.PENDING;
    const finalPriority = priority || TaskPriority.LOW;

    await prisma.task.create({
      data: {
        title,
        description,
        status: finalStatus,
        priority: finalPriority,
        assignedTo: assignee_to,
        teamId: team_id,
      },
    });

    return res.status(201).json({ message: `task ${title} with status ${finalStatus} and priority ${finalPriority} created` });
  }

  async index(req: Request, res: Response) {
    const tasks = await prisma.task.findMany();
    return res.status(200).json(tasks);
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;
    const task = await prisma.task.findUnique({
      where: {
        id,
      },
    });

    if (!task) {
      return res.status(404).json({ message: `task ${id} not found` });
    }

    const taskWithRelations = await prisma.task.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        team: {
          select: {
            name: true,
          },
        },
        assignedToId: {
          select: {
            name: true,
          },
        },
        title: true,
        description: true,
        status: true,
        priority: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return res.status(200).json(taskWithRelations);
  }

  async update(req: Request, res: Response) {
    const { id } = z.object({
      id: z.string(),
    }).parse(req.params);

    const { status, priority, title, description, assigned_to, team_id } = z.object({
      status: z.nativeEnum(TaskStatus).optional(),
      priority: z.nativeEnum(TaskPriority).optional(),
      title: z.string().optional(),
      description: z.string().optional(),
      assigned_to: z.string().optional(),
      team_id: z.string().optional(),
    }).parse(req.body);

    try {
      const currentTask = await prisma.task.findUnique({
        where: { id },
      });

      if (!currentTask) {
        return res.status(404).json({ message: `Task ${id} not found` });
      }

      const updatedData: any = {};

      if (status && (status === TaskStatus.PENDING || status === TaskStatus.IN_PROGRESS || status === TaskStatus.COMPLETED)) {
        updatedData.status = status;
      }

      if (priority && (priority === TaskPriority.LOW || priority === TaskPriority.MEDIUM || priority === TaskPriority.HIGH)) {
        updatedData.priority = priority;
      }

      if (title) {
        updatedData.title = title;
      }

      if (description) {
        updatedData.description = description;
      }

      if (assigned_to) {
        updatedData.assignedTo = assigned_to;
      }

      if (team_id) {
        updatedData.teamId = team_id;
      }

      await prisma.task.update({
        where: { id },
        data: updatedData,
      });

      return res.status(200).json({ message: "Task updated successfully" });
    } catch (error) {
      console.error("Error updating task:", error);
      return res.status(500).json({ message: "Error updating task", error: (error as Error).message });
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    await prisma.task.delete({
      where: {
        id,
      },
    });
    return res.status(200).json({ message: `task ${id} deleted` });
  }
}

export { TasksController };