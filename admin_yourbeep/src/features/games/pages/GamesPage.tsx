import { useEffect, useMemo, useState } from "react";
import { Blocks } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../store";
import {
  createAdminGame,
  deleteAdminGame,
  fetchAdminGamesLibrary,
  restoreAdminGame,
  updateAdminGame,
} from "../../../store/slices/games";
import { showToast } from "../../../utils/showToast";
import GameFormPanel from "../components/GameFormPanel";
import GamesPageSkeleton from "../components/GamesPageSkeleton";
import GamesSummaryCards from "../components/GamesSummaryCards";
import GamesTable from "../components/GamesTable";
import GamesToolbar from "../components/GamesToolbar";
import { useGameForm } from "../hooks/useGameForm";

export default function GamesPage() {
  const dispatch = useAppDispatch();
  const { items, hasLoaded, loading, mutating, error } = useAppSelector(
    (state) => state.games,
  );
  const form = useGameForm();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "active" | "archived">("");

  useEffect(() => {
    if (!hasLoaded && !loading) {
      dispatch(fetchAdminGamesLibrary());
    }
  }, [dispatch, hasLoaded, loading]);

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return items.filter((item) => {
      const matchesQuery =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.key.toLowerCase().includes(query) ||
        String(item.description || "")
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        !statusFilter ||
        (statusFilter === "active" ? item.isActive : !item.isActive);

      return matchesQuery && matchesStatus;
    });
  }, [items, searchQuery, statusFilter]);

  if (loading && !hasLoaded) {
    return <GamesPageSkeleton />;
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-[#e8eadf] bg-white p-6 shadow-sm">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d9e7d2] bg-[#f4f9ef] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#3b6b47]">
            <Blocks className="h-3.5 w-3.5" />
            Games Library
          </div>
          <h1 className="mt-4 text-[28px] font-bold tracking-tight text-gray-900">
            Maintain the reusable games attached to courses
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-gray-600">
            Create and maintain the reusable games that power course scoring,
            in-video activity cues, and downstream gameplay flows across the platform.
          </p>
        </div>
      </section>

      {error ? (
        <div className="rounded-2xl border border-[#f3e2b4] bg-[#fff9ea] px-4 py-3 text-sm text-[#9a7a19]">
          Game data could not be fully refreshed: {error}
        </div>
      ) : null}

      <GamesSummaryCards items={items} loading={loading && !items.length} />

      <section className="rounded-[24px] border border-[#e7eadf] bg-white p-6 shadow-sm">
        <GamesToolbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          onCreate={form.openCreate}
        />
      </section>

      <GamesTable
        items={filteredItems}
        loading={loading}
        onEdit={form.openEdit}
        onToggleArchive={(game) => {
          const isArchiving = game.isActive;
          const loadingId = showToast({
            type: "loading",
            message: isArchiving ? "Archiving game..." : "Restoring game...",
            options: {
              description: isArchiving
                ? "Updating the game library status."
                : "Bringing the game back into the active library.",
            },
          });

          dispatch(isArchiving ? deleteAdminGame(game._id) : restoreAdminGame(game._id))
            .unwrap()
            .then(() => {
              showToast({
                type: "success",
                message: isArchiving ? "Game archived." : "Game restored.",
                options: {
                  id: loadingId,
                  description: isArchiving
                    ? "The game was archived successfully."
                    : "The game is active in the library again.",
                },
              });
            })
            .catch((gameError: unknown) => {
              showToast({
                type: "error",
                message: isArchiving
                  ? "Unable to archive game."
                  : "Unable to restore game.",
                options: {
                  id: loadingId,
                  description:
                    typeof gameError === "string"
                      ? gameError
                      : "Please try again.",
                },
              });
            });
        }}
      />

      <GameFormPanel
        isOpen={form.isOpen}
        form={form.form}
        setForm={form.setForm}
        editingGame={form.editingGame}
        loading={mutating}
        onClose={form.close}
        onSubmit={() => {
          const loadingId = showToast({
            type: "loading",
            message: form.editingGame ? "Saving game..." : "Creating game...",
            options: {
              description: "Updating the reusable game library.",
            },
          });

          const action = form.editingGame
            ? updateAdminGame({
                gameId: form.editingGame._id,
                payload: {
                  title: form.payload.title,
                  ...(form.payload.description
                    ? { description: form.payload.description }
                    : {}),
                },
              })
            : createAdminGame(form.payload);

          dispatch(action)
            .unwrap()
            .then(() => {
              form.close();
              showToast({
                type: "success",
                message: form.editingGame ? "Game updated." : "Game created.",
                options: {
                  id: loadingId,
                  description: form.editingGame
                    ? "The game details were saved successfully."
                    : "The new game was added to the library.",
                },
              });
            })
            .catch((gameError: unknown) => {
              showToast({
                type: "error",
                message: form.editingGame
                  ? "Unable to update game."
                  : "Unable to create game.",
                options: {
                  id: loadingId,
                  description:
                    typeof gameError === "string"
                      ? gameError
                      : "Please review the form and try again.",
                },
              });
            });
        }}
      />
    </div>
  );
}
