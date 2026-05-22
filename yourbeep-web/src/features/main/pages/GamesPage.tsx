import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "@components/common/PrimaryButton";
import { appRoutes } from "@constants/routes";
import MainPageShell from "../components/MainPageShell";
import { useGameLibrary } from "../hooks/useGameLibrary";

const GamesPage = () => {
  const navigate = useNavigate();
  const { games, loading, error } = useGameLibrary();
  const [search, setSearch] = useState("");

  const filteredGames = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return games;
    }

    return games.filter((game) =>
      [game.title, game.courseTitle, game.gameKey]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [games, search]);

  return (
    <MainPageShell activeItem="Games">
      <h1 className="mb-3 text-[40px] font-bold" style={{ color: "#2a5a64" }}>
        Games Library
      </h1>
      <p className="mb-8 max-w-[600px] text-[13px] leading-relaxed text-[#7a8a8a]">
        Enter each practice with presence. Games unlock when the matching course
        is part of your active journey.
      </p>

      <div className="mb-10 flex items-center gap-3">
        <div className="relative max-w-[380px] flex-1">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#9aacac"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search games"
            className="w-full rounded-full border-none px-11 py-2.5 text-[13px] text-[#1a2e38] outline-none"
            style={{ backgroundColor: "white" }}
          />
        </div>
      </div>

      {loading ? (
        <div className="mb-10 rounded-2xl bg-white px-6 py-5 text-sm text-[#6a7a7a] shadow-sm">
          Loading your practice library...
        </div>
      ) : null}

      {error ? (
        <div className="mb-10 rounded-2xl bg-white px-6 py-5 text-sm text-[#7a4545] shadow-sm">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredGames.map((game) => (
          <div
            key={game.id}
            className="group overflow-hidden rounded-2xl bg-white"
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}
          >
            <div className="relative h-[220px] overflow-hidden">
              <img
                src={game.courseThumbnail}
                alt={game.title}
                className={`h-full w-full object-cover transition-transform duration-300 ${
                  game.hasAccess ? "group-hover:scale-105" : ""
                }`}
              />
              <div
                className="absolute inset-0"
                style={{
                  background: game.hasAccess
                    ? "linear-gradient(to top, rgba(10,25,30,0.55), rgba(10,25,30,0.08))"
                    : "linear-gradient(to top, rgba(10,25,30,0.72), rgba(10,25,30,0.38))",
                }}
              />
              <span className="absolute left-4 top-4 rounded-full bg-white/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#294f58]">
                {game.type}
              </span>
              {!game.hasAccess ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="rounded-full bg-white/90 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a4030]">
                    Locked
                  </div>
                </div>
              ) : null}
            </div>

            <div className="p-5">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7c9090]">
                {game.courseTitle}
              </p>
              <h3 className="mb-2 text-[18px] font-bold text-[#1a2e38]">
                {game.title}
              </h3>
              <p className="mb-4 text-[12px] text-[#607575]">
                {game.badgeLabel}
              </p>

              {game.hasAccess ? (
                <PrimaryButton
                  onClick={() => navigate(appRoutes.courseGame(game.courseId, game.id))}
                  className="w-full rounded-full py-3 text-[11px] font-semibold uppercase tracking-[0.16em]"
                >
                  Play Game
                </PrimaryButton>
              ) : (
                <PrimaryButton
                  onClick={() => navigate(appRoutes.courseDetail(game.courseId))}
                  className="w-full rounded-full py-3 text-[11px] font-semibold uppercase tracking-[0.16em]"
                >
                  Unlock via Course
                </PrimaryButton>
              )}
            </div>
          </div>
        ))}
      </div>
    </MainPageShell>
  );
};

export default GamesPage;
