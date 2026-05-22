import DashboardHeroCard from "@features/dashboard/components/DashboardHeroCard";
import DeepMetricsPanel from "@features/dashboard/components/DeepMetricsPanel";
import MainPageShell from "@features/main/components/MainPageShell";
import MorningStateCard from "@features/dashboard/components/MorningStateCard";
import RecommendedSection from "@features/dashboard/components/RecommendedSection";
import { useDashboardData } from "../hooks/useDashboardData";
import MainFooter from "../components/MainFooter";

const DashboardPage = () => {
  const { dashboard, loading, error } = useDashboardData();

  const header = dashboard?.header;
  const metrics = dashboard?.metrics ?? [];
  const progression = dashboard?.progression;
  const engagement = dashboard?.activityEngagement;
  const name = header?.user?.name ?? "Guest";
  const greeting = header?.greeting ?? "Good morning";
  const subtitle =
    header?.subtitle ?? "The quiet moments hold the most profound lessons.";
  const userLevel = progression?.level ?? 0;
  const nextLevelXp = progression?.nextLevelXp ?? 0;
  const totalXp = progression?.totalXp ?? 0;
  const progressPercent = progression?.progressPercentage ?? 0;
  const observationMinutes = engagement?.observationTime?.minutes ?? 0;
  const reflectionMinutes = engagement?.reflectionTime?.minutes ?? 0;
  const observationTrend = engagement?.observationTime?.changePercentage ?? 0;
  const reflectionTrend = engagement?.reflectionTime?.changePercentage ?? 0;
  const coherencePercent =
    metrics.find((metric) => metric.id === "emotional_signal")?.score ?? 0;
  const restorationPercent =
    metrics.find((metric) => metric.id === "physiological_efficiency")?.score ??
    0;

  return (
    <MainPageShell activeItem="Dashboard">
      <DashboardHeroCard name={name} greeting={greeting} subtitle={subtitle} />

      {loading && !dashboard ? (
        <div className="rounded-3xl bg-white px-8 py-16 text-center text-sm text-[#5a6a6a] shadow-sm">
          Loading your sanctuary...
        </div>
      ) : error && !dashboard ? (
        <div className="rounded-3xl bg-white px-8 py-16 text-center shadow-sm">
          <p className="text-base font-semibold text-[#1a2e38]">
            We couldn&apos;t load your dashboard.
          </p>
          <p className="mt-2 text-sm text-[#6c7a7a]">{error}</p>
        </div>
      ) : (
        <>
          <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <MorningStateCard
              name={name}
              userLevel={userLevel}
              nextLevelXp={nextLevelXp}
              totalXp={totalXp}
              progressPercent={progressPercent}
              observationMinutes={observationMinutes}
              reflectionMinutes={reflectionMinutes}
              observationTrend={observationTrend}
              reflectionTrend={reflectionTrend}
            />
            <DeepMetricsPanel
              coherencePercent={coherencePercent}
              restorationPercent={restorationPercent}
            />
          </div>

          <RecommendedSection recommendations={dashboard?.recommendations} />
          <MainFooter />
        </>
      )}
    </MainPageShell>
  );
};

export default DashboardPage;
