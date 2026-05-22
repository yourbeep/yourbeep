import { AppError } from "@yourbeep/shared";
import { GameModel } from "../models/game";
import type { z } from "zod";
import { createGameSchema, updateGameSchema } from "../validators";

type CreateGameInput = z.infer<typeof createGameSchema>;
type UpdateGameInput = z.infer<typeof updateGameSchema>;

export const listGames = async (includeInactive = true) => {
  const filter = includeInactive ? {} : { isActive: true };
  return GameModel.find(filter).sort({ createdAt: -1 });
};

export const createGame = async (payload: CreateGameInput) => {
  const existing = await GameModel.findOne({ key: payload.key });
  if (existing) {
    throw new AppError("Game key already exists", 409, "CONFLICT");
  }

  const game = await GameModel.create(payload);
  return game;
};

export const updateGame = async (id: string, payload: UpdateGameInput) => {
  const game = await GameModel.findByIdAndUpdate(id, { $set: payload }, { new: true });
  if (!game) {
    throw new AppError("Game not found", 404, "GAME_NOT_FOUND");
  }

  return game;
};

export const softDeleteGame = async (id: string) => {
  const game = await GameModel.findByIdAndUpdate(id, { $set: { isActive: false } }, { new: true });
  if (!game) {
    throw new AppError("Game not found", 404, "GAME_NOT_FOUND");
  }

  return game;
};

export const restoreGame = async (id: string) => {
  const game = await GameModel.findByIdAndUpdate(id, { $set: { isActive: true } }, { new: true });
  if (!game) {
    throw new AppError("Game not found", 404, "GAME_NOT_FOUND");
  }

  return game;
};
