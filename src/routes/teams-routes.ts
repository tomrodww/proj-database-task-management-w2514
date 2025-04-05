import { Router } from "express";
import { TeamsController } from "../controllers/teams-controller";
import { ensureAuth } from "../middlewares/ensure-authentication";
import { ensureAuthorized } from "../middlewares/ensure-authorized";

const teamsRoutes = Router();

const teamsController = new TeamsController();

teamsRoutes.post("/", ensureAuth, ensureAuthorized, teamsController.create);
teamsRoutes.get("/", teamsController.index);
teamsRoutes.patch("/:id", ensureAuth, ensureAuthorized, teamsController.update);
teamsRoutes.delete("/:id", ensureAuth, ensureAuthorized, teamsController.delete);

export { teamsRoutes };