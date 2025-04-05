import { Request, Response, NextFunction } from "express";
import { AppError } from "@/utils/AppError";

function ensureAuthorized(req: Request, res: Response, next: NextFunction) {
  const { role } = req.user;

  if (!role) {
    throw new AppError("User role is missing", 401);
  }

  if (role !== "ADMIN") {
    throw new AppError("Unauthorized", 403);
  }

  return next();
}

export { ensureAuthorized };

