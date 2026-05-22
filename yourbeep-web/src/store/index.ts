import { configureStore } from "@reduxjs/toolkit";
import {
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from "react-redux";
import { appReducer } from "./slices/app/appSlice";
import { authReducer } from "./slices/auth";
import { gamesReducer } from "./slices/games";
import { landingReducer } from "./slices/landing/landingSlice";
import { mainReducer } from "./slices/main";
import { paymentsReducer } from "./slices/payments";
import { settingsReducer } from "./slices/settings";

export const store = configureStore({
  reducer: {
    app: appReducer,
    auth: authReducer,
    games: gamesReducer,
    landing: landingReducer,
    main: mainReducer,
    payments: paymentsReducer,
    settings: settingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
