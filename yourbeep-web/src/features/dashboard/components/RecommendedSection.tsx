import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainButton from "@components/ui/MainButton";
import StatusPill from "@components/ui/StatusPill";
import { appRoutes } from "@constants/routes";
import type { MainRecommendation } from "@store/slices/main";

type RecommendedSectionProps = {
  recommendations?: MainRecommendation[];
};

const ITEMS_PER_PAGE = 3;

const RecommendedSection = ({
  recommendations = [],
}: RecommendedSectionProps) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(recommendations.length / ITEMS_PER_PAGE));

  const currentItems = useMemo(
    () =>
      recommendations.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE,
      ),
    [page, recommendations],
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: 0.16 }}
      className="mb-12"
    >
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-[24px] font-bold text-[#1a2e38]">
            Recommended for Your Journey
          </h3>
          <p className="mt-1 text-sm text-[var(--muted)]">
            A curated next set of quiet practices matched to your current state.
          </p>
        </div>
        <MainButton
          variant="ghost"
          size="sm"
          tailIcon={<ArrowRight className="h-4 w-4" />}
          onClick={() => navigate(appRoutes.games)}
        >
          View Library
        </MainButton>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {currentItems.length > 0 ? (
          currentItems.map((item) => (
            <motion.article
              key={item.id}
              layout
              className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.07)]"
            >
              <div className="relative h-[200px] overflow-hidden">
                <img
                  src={
                    item.thumbnailUrl ||
                    "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80"
                  }
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute left-3 top-3">
                  <StatusPill tone="muted">{item.category}</StatusPill>
                </div>
                <span
                  className="absolute right-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-semibold"
                  style={{
                    backgroundColor: "rgba(26,58,64,0.75)",
                    color: "white",
                  }}
                >
                  {item.durationMinutes} min
                </span>
              </div>
              <div className="p-4">
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                  {item.contentType}
                </p>
                <h4 className="mb-3 text-[16px] font-bold text-[#1a2e38]">
                  {item.title}
                </h4>
                <MainButton
                  fullWidth
                  variant="soft"
                  onClick={() => navigate(appRoutes.games)}
                >
                  Open
                </MainButton>
              </div>
            </motion.article>
          ))
        ) : (
          <div
            className="col-span-3 rounded-2xl bg-white p-10 text-center"
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}
          >
            <p className="text-[14px] text-[#5a6a6a]">
              No personalized recommendations are available yet.
            </p>
          </div>
        )}
      </div>

      {totalPages > 1 ? (
        <div className="mt-6 flex items-center justify-center gap-3">
          <MainButton
            size="sm"
            variant="outline"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page === 1}
          >
            Previous
          </MainButton>
          <StatusPill tone="primary" className="normal-case tracking-normal">
            Page {page} of {totalPages}
          </StatusPill>
          <MainButton
            size="sm"
            variant="outline"
            onClick={() =>
              setPage((current) => Math.min(totalPages, current + 1))
            }
            disabled={page === totalPages}
          >
            Next
          </MainButton>
        </div>
      ) : null}
    </motion.section>
  );
};

export default RecommendedSection;
