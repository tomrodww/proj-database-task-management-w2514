import { Router } from "express";
import { TasksController } from "@/controllers/tasks-controller";
import { ensureAuth } from "@/middlewares/ensure-authentication";
import { ensureAuthorized } from "@/middlewares/ensure-authorized";

const tasksRoutes = Router();

const tasksController = new TasksController();

tasksRoutes.post("/", ensureAuth, ensureAuthorized, tasksController.create);
tasksRoutes.get("/", tasksController.index);
tasksRoutes.get("/:id", tasksController.show);
tasksRoutes.patch("/:id", ensureAuth, tasksController.update);
tasksRoutes.delete("/:id", ensureAuth, ensureAuthorized, tasksController.delete);


export { tasksRoutes };
