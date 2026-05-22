import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { MainButton } from "./MainButton";

type AppPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function buildPages(currentPage: number, totalPages: number) {
  const pages: Array<number | "..."> = [];

  for (let index = 1; index <= totalPages; index += 1) {
    if (
      index === 1 ||
      index === totalPages ||
      (index >= currentPage - 1 && index <= currentPage + 1)
    ) {
      pages.push(index);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return pages;
}

export function AppPagination({
  currentPage,
  totalPages,
  onPageChange,
}: AppPaginationProps) {
  const pages = buildPages(currentPage, totalPages);

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 py-5">
      <MainButton
        text="Prev"
        size="sm"
        variant="outline"
        headIcon={<ChevronLeft className="h-4 w-4" />}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      />

      {pages.map((page, index) =>
        page === "..." ? (
          <span
            key={`ellipsis-${index}`}
            className="inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-transparent px-2 text-slate-400"
          >
            <MoreHorizontal className="h-4 w-4" />
          </span>
        ) : (
          <MainButton
            key={`page-${page}`}
            text={String(page)}
            size="sm"
            variant={currentPage === page ? "primary" : "outline"}
            onClick={() => onPageChange(page)}
          />
        ),
      )}

      <MainButton
        text="Next"
        size="sm"
        variant="outline"
        tailIcon={<ChevronRight className="h-4 w-4" />}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      />
    </div>
  );
}
