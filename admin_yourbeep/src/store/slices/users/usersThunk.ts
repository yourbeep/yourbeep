import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../../../services/api";
import { getApiErrorMessage } from "../../../utils/apiError";
import type { UserListPayload, UsersFilters } from "./usersTypes";

export const fetchUsers = createAsyncThunk<
  UserListPayload,
  UsersFilters | void,
  { rejectValue: string }
>("users/fetchUsers", async (filters, { rejectWithValue }) => {
  try {
    const response = await api.get("/admin/dashboard", {
      params: {
        page: filters?.page ?? 1,
        limit: filters?.limit ?? 10,
        ...(filters?.q ? { q: filters.q } : {}),
        ...(filters?.region ? { region: filters.region } : {}),
        ...(filters?.planType ? { planType: filters.planType } : {}),
        ...(typeof filters?.isActive === "boolean"
          ? { isActive: filters.isActive }
          : {}),
      },
    });

    const data = response.data?.data ?? {};

    return {
      stats: {
        totalUsers: data.stats?.totalUsers ?? { value: 0, changePercent: 0 },
        activeUsers: data.stats?.activeUsers ?? { value: 0, changePercent: 0 },
        newSignups: data.stats?.newSignups ?? { value: 0, changePercent: 0 },
      },
      overview: {
        totalStudents: data.overview?.totalStudents ?? {
          current: 0,
          previous: 0,
          delta: 0,
          percentChange: 0,
        },
        monthlyRevenue: data.overview?.monthlyRevenue ?? {
          current: 0,
          previous: 0,
          delta: 0,
          percentChange: 0,
        },
      },
      students: data.students ?? {
        items: [],
        pagination: {
          page: filters?.page ?? 1,
          limit: filters?.limit ?? 10,
          total: 0,
        },
      },
    } as UserListPayload;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        getApiErrorMessage(err.response?.data, "Unable to load students."),
      );
    }

    return rejectWithValue("Unable to load students.");
  }
});
