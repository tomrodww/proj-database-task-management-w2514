import { Router } from "express";
import { SessionsController } from "../controllers/sessions-controller";

const sessionsRoutes = Router();

const sessionsController = new SessionsController();

sessionsRoutes.post("/", sessionsController.create);
sessionsRoutes.get("/", sessionsController.index);
sessionsRoutes.delete("/", sessionsController.delete);

export { sessionsRoutes };
