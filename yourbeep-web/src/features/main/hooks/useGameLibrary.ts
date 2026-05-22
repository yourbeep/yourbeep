import { useEffect, useState } from "react";
import { getApiErrorMessage } from "@utils/apiError";
import { libraryApi } from "../services/libraryApi";
import type { GameLibraryItem } from "../services/libraryTypes";

export const useGameLibrary = () => {
  const [games, setGames] = useState<GameLibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const items = await libraryApi.getGameLibrary();
        if (!active) return;
        setGames(items);
      } catch (loadError) {
        if (!active) return;
        setError(getApiErrorMessage(loadError, "Unable to load games."));
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, []);

  return { games, loading, error };
};
