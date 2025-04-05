import express from "express";
import "express-async-errors";
import { errorHandling } from "@/middlewares/error-handling";
import { router } from "@/routes";

const app = express();

app.use(express.json());

app.use(router);

app.use(errorHandling);

export { app };
