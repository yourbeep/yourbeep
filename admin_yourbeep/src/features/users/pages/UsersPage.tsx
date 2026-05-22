import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { MdSearch } from "react-icons/md";
import { AnimatedDropdown } from "../../../components/ui/AnimatedDropdown";
import { AppPagination } from "../../../components/ui/AppPagination";
import { MainButton } from "../../../components/ui/MainButton";
import { showToast } from "../../../utils/showToast";
import { useAppDispatch, useAppSelector } from "../../../store";
import { fetchUsers } from "../../../store/slices/users";
import StudentSummaryCards from "../components/StudentSummaryCards";
import StudentTable from "../components/StudentTable";
import UsersPageSkeleton from "../components/UsersPageSkeleton";

const statusOptions = [
  { label: "All Students", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const planOptions = [
  { label: "All Plans", value: "all" },
  { label: "Six Month", value: "six_month" },
  { label: "Annual", value: "annual" },
];

const pageSizeOptions = [
  { label: "10 per page", value: "10" },
  { label: "25 per page", value: "25" },
  { label: "50 per page", value: "50" },
];

export default function UsersPage() {
  const dispatch = useAppDispatch();
  const { data, loading, error, filters } = useAppSelector((state) => state.users);
  const [searchQuery, setSearchQuery] = useState(filters.q);

  useEffect(() => {
    if (!data && !loading) {
      void dispatch(
        fetchUsers({ page: 1, limit: 10, q: "", isActive: undefined }),
      );
    }
  }, [data, dispatch, loading]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (searchQuery !== filters.q) {
        void dispatch(
          fetchUsers({
            ...filters,
            page: 1,
            q: searchQuery.trim(),
          }),
        );
      }
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [dispatch, filters, searchQuery]);

  useEffect(() => {
    if (error) {
      showToast({
        type: "error",
        message: "Unable to load students.",
        options: {
          description: error,
          duration: 4200,
        },
      });
    }
  }, [error]);

  const currentStatus = useMemo(() => {
    if (typeof filters.isActive !== "boolean") {
      return "all";
    }

    return filters.isActive ? "active" : "inactive";
  }, [filters.isActive]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      (data?.students.pagination.total || 0) /
        (data?.students.pagination.limit || filters.limit || 10),
    ),
  );

  const regionOptions = useMemo(() => {
    const uniqueRegions = Array.from(
      new Set(
        (data?.students.items ?? [])
          .map((student) => student.region)
          .filter((value): value is string => Boolean(value)),
      ),
    ).sort();

    return [
      { label: "All Regions", value: "all" },
      ...uniqueRegions.map((region) => ({
        label: region,
        value: region,
      })),
    ];
  }, [data?.students.items]);

  const handleStatusChange = (value: string) => {
    void dispatch(
      fetchUsers({
        ...filters,
        page: 1,
        q: searchQuery.trim(),
        isActive: value === "all" ? undefined : value === "active",
      }),
    );
  };

  const handleLimitChange = (value: string) => {
    void dispatch(
      fetchUsers({
        ...filters,
        page: 1,
        q: searchQuery.trim(),
        limit: Number(value),
      }),
    );
  };

  const handleRegionChange = (value: string) => {
    void dispatch(
      fetchUsers({
        ...filters,
        page: 1,
        q: searchQuery.trim(),
        region: value === "all" ? undefined : value,
      }),
    );
  };

  const handlePlanChange = (value: string) => {
    void dispatch(
      fetchUsers({
        ...filters,
        page: 1,
        q: searchQuery.trim(),
        planType:
          value === "all" ? undefined : (value as "six_month" | "annual"),
      }),
    );
  };

  const handlePageChange = (page: number) => {
    void dispatch(
      fetchUsers({
        ...filters,
        page,
        q: searchQuery.trim(),
      }),
    );
  };

  if (loading && !data) {
    return <UsersPageSkeleton />;
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-bg-cream p-6">
        <div className="rounded-[28px] border border-[#f3d2c8] bg-[#fff6f2] p-6 text-[#b5574e] shadow-sm">
          <h2 className="text-lg font-bold">Students failed to load</h2>
          <p className="mt-2 text-sm">{error}</p>
          <div className="mt-5">
            <MainButton
              text="Try Again"
              onClick={() =>
                void dispatch(
                  fetchUsers({
                    page: filters.page,
                    limit: filters.limit,
                    q: filters.q,
                    isActive: filters.isActive,
                  }),
                )
              }
            />
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="min-h-screen space-y-6 bg-bg-cream p-6">
      <StudentSummaryCards data={data} loading={loading} />

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-[28px] border border-[#dfe8d6] bg-white p-5 shadow-sm"
      >
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-[24px] font-bold text-[#203321]">
              Student Directory
            </h2>
            <p className="mt-1 text-sm text-[#70806d]">
              Review real learner activity, purchases, plan mix, and account
              health using the backend filters currently supported by the
              platform.
            </p>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
            <div className="relative min-w-[280px]">
              <MdSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xl text-[#8e9988]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by name or email"
                className="w-full rounded-2xl border border-[#dfe8d6] bg-[#fbfcf8] py-3 pl-10 pr-4 text-sm text-[#203321] outline-none transition focus:border-[#0d6e6e] focus:bg-white"
              />
            </div>

            <div className="min-w-[180px]">
              <AnimatedDropdown
                name="student-status"
                value={currentStatus}
                options={statusOptions}
                onChange={handleStatusChange}
                placeholder="Filter by status"
                className="w-full"
              />
            </div>

            <div className="min-w-[160px]">
              <AnimatedDropdown
                name="student-region"
                value={filters.region || "all"}
                options={regionOptions}
                onChange={handleRegionChange}
                placeholder="Filter by region"
                className="w-full"
              />
            </div>

            <div className="min-w-[150px]">
              <AnimatedDropdown
                name="student-plan"
                value={filters.planType || "all"}
                options={planOptions}
                onChange={handlePlanChange}
                placeholder="Filter by plan"
                className="w-full"
              />
            </div>

            <div className="min-w-[150px]">
              <AnimatedDropdown
                name="student-limit"
                value={String(filters.limit)}
                options={pageSizeOptions}
                onChange={handleLimitChange}
                placeholder="Page size"
                className="w-full"
              />
            </div>
          </div>
        </div>

        {error ? (
          <div className="mt-4 rounded-2xl border border-[#f3e2b4] bg-[#fff9ea] px-4 py-3 text-sm text-[#9a7a19]">
            Showing last loaded student data. Latest request issue: {error}
          </div>
        ) : null}

        <div className="mt-5 overflow-hidden rounded-[24px] border border-[#e6edde]">
          <StudentTable items={data.students.items} loading={loading} />
        </div>

        <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-sm text-[#72806e]">
            Showing{" "}
            <span className="font-semibold text-[#203321]">
              {data.students.items.length
                ? (data.students.pagination.page - 1) *
                    data.students.pagination.limit +
                  1
                : 0}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-[#203321]">
              {(data.students.pagination.page - 1) *
                data.students.pagination.limit +
                data.students.items.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-[#203321]">
              {data.students.pagination.total.toLocaleString()}
            </span>{" "}
            students
          </p>

          <AppPagination
            currentPage={data.students.pagination.page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </motion.div>
    </div>
  );
}
