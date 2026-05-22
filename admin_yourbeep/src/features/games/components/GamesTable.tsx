import { motion } from "framer-motion";
import { Archive, PencilLine, RotateCcw } from "lucide-react";
import { MainButton } from "../../../components/ui/MainButton";
import { ShimmerBlock } from "../../../components/ui/ShimmerBlock";
import { StatusPill } from "../../../components/ui/StatusPill";
import type { AdminGame } from "../../../store/slices/games";

type GamesTableProps = {
  items: AdminGame[];
  loading?: boolean;
  onEdit: (game: AdminGame) => void;
  onToggleArchive: (game: AdminGame) => void;
};

function GameRowSkeleton() {
  return (
    <tr className="border-b border-[#edf0e7]">
      {Array.from({ length: 5 }).map((_, index) => (
        <td key={index} className="px-4 py-4">
          <ShimmerBlock className={`h-4 ${index === 2 ? "w-full max-w-[260px]" : "w-full max-w-[120px]"}`} />
        </td>
      ))}
    </tr>
  );
}

export default function GamesTable({
  items,
  loading = false,
  onEdit,
  onToggleArchive,
}: GamesTableProps) {
  if (loading && !items.length) {
    return (
      <div className="overflow-hidden rounded-[24px] border border-[#e7eadf] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#edf0e7]">
            <thead className="bg-[#f7f8f3]">
              <tr>
                {["Title", "Key", "Description", "Status", "Actions"].map((label) => (
                  <th
                    key={label}
                    className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-[#83907e]"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 6 }).map((_, index) => (
                <GameRowSkeleton key={index} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="rounded-[24px] border border-dashed border-[#d8e3d2] bg-[#fbfcf8] px-6 py-14 text-center">
        <p className="text-lg font-semibold text-[#203321]">No games in the library yet</p>
        <p className="mt-2 text-sm text-[#74816f]">
          Create the reusable games first, then assign them inside course creation.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[24px] border border-[#e7eadf] bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#edf0e7]">
          <thead className="bg-[#f7f8f3]">
            <tr>
              {["Title", "Key", "Description", "Status", "Actions"].map((label) => (
                <th
                  key={label}
                  className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-[#83907e]"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#edf0e7]">
            {items.map((game, index) => (
              <motion.tr
                key={game._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18, delay: index * 0.02 }}
                className="transition hover:bg-[#fbfcf8]"
              >
                <td className="px-4 py-4">
                  <p className="text-sm font-semibold text-[#203321]">{game.title}</p>
                </td>
                <td className="px-4 py-4 text-sm text-[#304132]">{game.key}</td>
                <td className="px-4 py-4">
                  <p className="max-w-[420px] text-sm text-[#74816f]">
                    {game.description || "No description"}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <StatusPill
                    variant={game.isActive ? "success" : "danger"}
                    dot
                  >
                    {game.isActive ? "Active" : "Archived"}
                  </StatusPill>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    <MainButton
                      text="Edit"
                      size="sm"
                      variant="outline"
                      headIcon={<PencilLine className="h-4 w-4" />}
                      onClick={() => onEdit(game)}
                    />
                    <MainButton
                      text={game.isActive ? "Archive" : "Restore"}
                      size="sm"
                      variant={game.isActive ? "danger" : "soft"}
                      headIcon={
                        game.isActive ? (
                          <Archive className="h-4 w-4" />
                        ) : (
                          <RotateCcw className="h-4 w-4" />
                        )
                      }
                      onClick={() => onToggleArchive(game)}
                    />
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
