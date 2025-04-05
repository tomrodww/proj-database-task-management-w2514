import { Router } from "express";
import { usersRoutes } from "./users-routes";
import { sessionsRoutes } from "./sessions-routes";
import { tasksRoutes } from "./tasks-routes";
import { teamsRoutes } from "./teams-routes";
import { teamsMembersRoutes } from "./teams-members-routes";

const router = Router();

router.use("/users", usersRoutes);
router.use("/sessions", sessionsRoutes);
router.use("/tasks", tasksRoutes);
router.use("/teams", teamsRoutes);
router.use("/teams-members", teamsMembersRoutes);

export { router };
