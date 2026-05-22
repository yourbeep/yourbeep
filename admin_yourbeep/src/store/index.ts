import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { authReducer } from "./slices/auth";
import { coursesReducer } from "./slices/courses";
import { dashboardReducer } from "./slices/dashboard";
import { gamesReducer } from "./slices/games";
import { notificationsReducer } from "./slices/notifications";
import { offersReducer } from "./slices/offers";
import { ordersReducer } from "./slices/orders";
import { profileReducer } from "./slices/profile";
import { settingsReducer } from "./slices/settings";
import { supportReducer } from "./slices/support";
import { testimonialsReducer } from "./slices/testimonials";
import { usersReducer } from "./slices/users";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: coursesReducer,
    dashboard: dashboardReducer,
    games: gamesReducer,
    notifications: notificationsReducer,
    offers: offersReducer,
    orders: ordersReducer,
    profile: profileReducer,
    settings: settingsReducer,
    support: supportReducer,
    testimonials: testimonialsReducer,
    users: usersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
