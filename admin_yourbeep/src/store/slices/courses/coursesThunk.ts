import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../../../services/api";
import { getApiErrorMessage } from "../../../utils/apiError";
import type { AdminCourse, AdminGame } from "./coursesTypes";

export const fetchAdminCourses = createAsyncThunk<
  AdminCourse[],
  void,
  { rejectValue: string }
>("courses/fetchAdminCourses", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/admin/courses");
    return (response.data?.data?.items ?? []) as AdminCourse[];
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        getApiErrorMessage(err.response?.data, "Unable to load courses."),
      );
    }

    return rejectWithValue("Unable to load courses.");
  }
});

export const fetchAdminGames = createAsyncThunk<
  AdminGame[],
  void,
  { rejectValue: string }
>("courses/fetchAdminGames", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/admin/games");
    return (response.data?.data?.items ?? []) as AdminGame[];
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        getApiErrorMessage(err.response?.data, "Unable to load games."),
      );
    }

    return rejectWithValue("Unable to load games.");
  }
});
