import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../../../services/api";
import { getApiErrorMessage } from "../../../utils/apiError";
import type { AdminGame } from "./gamesTypes";

const mapGame = (game: any): AdminGame => ({
  _id: String(game?._id || ""),
  key: String(game?.key || ""),
  title: String(game?.title || ""),
  description: typeof game?.description === "string" ? game.description : null,
  isActive: Boolean(game?.isActive ?? true),
  createdAt: typeof game?.createdAt === "string" ? game.createdAt : undefined,
  updatedAt: typeof game?.updatedAt === "string" ? game.updatedAt : undefined,
});

export const fetchAdminGamesLibrary = createAsyncThunk<
  AdminGame[],
  void,
  { rejectValue: string }
>("games/fetchAdminGamesLibrary", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/admin/games");
    return Array.isArray(response.data?.data?.items)
      ? response.data.data.items.map(mapGame)
      : [];
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        getApiErrorMessage(err.response?.data, "Unable to load game library."),
      );
    }

    return rejectWithValue("Unable to load game library.");
  }
});

export const createAdminGame = createAsyncThunk<
  AdminGame,
  Record<string, unknown>,
  { rejectValue: string }
>("games/createAdminGame", async (payload, { rejectWithValue }) => {
  try {
    const response = await api.post("/admin/games", payload);
    return mapGame(response.data?.data?.game ?? {});
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        getApiErrorMessage(err.response?.data, "Unable to create game."),
      );
    }

    return rejectWithValue("Unable to create game.");
  }
});

export const updateAdminGame = createAsyncThunk<
  AdminGame,
  { gameId: string; payload: Record<string, unknown> },
  { rejectValue: string }
>("games/updateAdminGame", async ({ gameId, payload }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/admin/games/${gameId}`, payload);
    return mapGame(response.data?.data?.game ?? {});
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        getApiErrorMessage(err.response?.data, "Unable to update game."),
      );
    }

    return rejectWithValue("Unable to update game.");
  }
});

export const deleteAdminGame = createAsyncThunk<
  AdminGame,
  string,
  { rejectValue: string }
>("games/deleteAdminGame", async (gameId, { rejectWithValue }) => {
  try {
    const response = await api.delete(`/admin/games/${gameId}`);
    return mapGame(response.data?.data?.game ?? {});
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        getApiErrorMessage(err.response?.data, "Unable to archive game."),
      );
    }

    return rejectWithValue("Unable to archive game.");
  }
});

export const restoreAdminGame = createAsyncThunk<
  AdminGame,
  string,
  { rejectValue: string }
>("games/restoreAdminGame", async (gameId, { rejectWithValue }) => {
  try {
    const response = await api.post(`/admin/games/${gameId}/restore`);
    return mapGame(response.data?.data?.game ?? {});
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        getApiErrorMessage(err.response?.data, "Unable to restore game."),
      );
    }

    return rejectWithValue("Unable to restore game.");
  }
});
