import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@store";
import { fetchMainDashboard } from "@store/slices/main";

export const useMainDashboard = () => {
  const dispatch = useAppDispatch();
  const dashboard = useAppSelector((state) => state.main.dashboard);
  const loading = useAppSelector((state) => state.main.loading);
  const loaded = useAppSelector((state) => state.main.loaded);
  const error = useAppSelector((state) => state.main.error);

  useEffect(() => {
    if (!loaded && !loading) {
      void dispatch(fetchMainDashboard());
    }
  }, [dispatch, loaded, loading]);

  return {
    dashboard,
    loading,
    error,
    refresh: () => dispatch(fetchMainDashboard()),
  };
};
