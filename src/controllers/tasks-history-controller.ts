import { Request, Response } from "express";

class TasksLogsController {
  async create(req: Request, res: Response) {
    return res.status(201).json({ message: "task log created" });
  }

  async index(req: Request, res: Response) {
    return res.status(200).json({ message: "list users" });
  }
}

export { TasksLogsController };