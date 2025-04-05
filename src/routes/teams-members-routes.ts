import { Router } from "express";
import { TeamsMembersController } from "../controllers/teams-members-controllers";
import { ensureAuth } from "../middlewares/ensure-authentication";
import { ensureAuthorized } from "../middlewares/ensure-authorized";

const teamsMembersRoutes = Router();

const teamsMembersController = new TeamsMembersController();

teamsMembersRoutes.post("/", ensureAuth, ensureAuthorized, teamsMembersController.create);
teamsMembersRoutes.get("/", teamsMembersController.index);
teamsMembersRoutes.patch("/:id", ensureAuth, ensureAuthorized, teamsMembersController.update);
teamsMembersRoutes.delete("/:id", ensureAuth, ensureAuthorized, teamsMembersController.delete);

export { teamsMembersRoutes };
