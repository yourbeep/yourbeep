import { parseBody, success } from "@yourbeep/shared";
import type { Request, Response } from "express";
import { createGame, listGames, restoreGame, softDeleteGame, updateGame } from "../services/game.service";
import { createGameSchema, updateGameSchema } from "../validators";

export const listGamesController = async (_req: Request, res: Response) => {
  const items = await listGames(true);
  return success(res, { items }, "Games list");
};

export const createGameController = async (req: Request, res: Response) => {
  const payload = parseBody(createGameSchema, req.body);
  const game = await createGame(payload);
  return success(res, { game }, "Game created", 201);
};

export const updateGameController = async (req: Request, res: Response) => {
  const payload = parseBody(updateGameSchema, req.body);
  const game = await updateGame(String(req.params.id), payload);
  return success(res, { game }, "Game updated");
};

export const deleteGameController = async (req: Request, res: Response) => {
  const game = await softDeleteGame(String(req.params.id));
  return success(res, { game }, "Game soft-deleted");
};

export const restoreGameController = async (req: Request, res: Response) => {
  const game = await restoreGame(String(req.params.id));
  return success(res, { game }, "Game restored");
};
