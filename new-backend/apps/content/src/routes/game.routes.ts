import { Router } from "express";
import { asyncHandler, requireAdmin } from "@yourbeep/shared";
import {
  createGameController,
  deleteGameController,
  listGamesController,
  restoreGameController,
  updateGameController,
} from "../controllers/game.controller";

export const gameRouter = Router();

gameRouter.get("/admin/games", requireAdmin, asyncHandler(listGamesController));
gameRouter.post("/admin/games", requireAdmin, asyncHandler(createGameController));
gameRouter.put("/admin/games/:id", requireAdmin, asyncHandler(updateGameController));
gameRouter.delete("/admin/games/:id", requireAdmin, asyncHandler(deleteGameController));
gameRouter.post("/admin/games/:id/restore", requireAdmin, asyncHandler(restoreGameController));
