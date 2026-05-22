import { Plus } from "lucide-react";
import { AnimatedDropdown } from "../../../components/ui/AnimatedDropdown";
import { InputField } from "../../../components/ui/InputField";
import { MainButton } from "../../../components/ui/MainButton";

type GamesToolbarProps = {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  statusFilter: "" | "active" | "archived";
  setStatusFilter: (value: "" | "active" | "archived") => void;
  onCreate: () => void;
};

export default function GamesToolbar({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  onCreate,
}: GamesToolbarProps) {
  return (
    <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
      <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
        <InputField
          label="Search games"
          value={searchQuery}
          placeholder="Search by title, key, or description..."
          onChange={(event) => setSearchQuery(event.target.value)}
          inputClassName="bg-white"
        />

        <AnimatedDropdown
          name="games-status"
          label="Status"
          value={statusFilter}
          options={[
            { label: "All statuses", value: "" },
            { label: "Active", value: "active" },
            { label: "Archived", value: "archived" },
          ]}
          placeholder="All statuses"
          onChange={(value) =>
            setStatusFilter((value || "") as "" | "active" | "archived")
          }
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <MainButton
          text="Add Game"
          headIcon={<Plus className="h-4 w-4" />}
          onClick={onCreate}
        />
      </div>
    </div>
  );
}
