import { BellRing } from "lucide-react";
import { InputField } from "../../../components/ui/InputField";
import { MainButton } from "../../../components/ui/MainButton";
import { StatusPill } from "../../../components/ui/StatusPill";
import type { ProcessSubscriptionsResult } from "../../../store/slices/orders/ordersTypes";

type SubscriptionProcessorCardProps = {
  daysBeforeExpiry: string;
  setDaysBeforeExpiry: (value: string) => void;
  result: ProcessSubscriptionsResult | null;
  loading: boolean;
  onRun: () => void;
};

export default function SubscriptionProcessorCard({
  daysBeforeExpiry,
  setDaysBeforeExpiry,
  result,
  loading,
  onRun,
}: SubscriptionProcessorCardProps) {
  return (
    <section className="rounded-[24px] border border-[#e7eadf] bg-white p-6 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#203321]">
            Subscription Processing
          </h2>
          <p className="mt-1 text-sm text-[#74816f]">
            Trigger expiry reminder processing using the real backend automation route.
          </p>
        </div>
        {result ? (
          <StatusPill variant="info" size="md" dot>
            Last run: {result.daysBeforeExpiry} day reminder window
          </StatusPill>
        ) : null}
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        <div className="w-full lg:max-w-[220px]">
          <InputField
            label="Reminder Window"
            type="number"
            value={daysBeforeExpiry}
            onChange={(event) => setDaysBeforeExpiry(event.target.value)}
            inputClassName="bg-white"
            helpText="How many days before expiry reminders should be sent."
          />
        </div>

        <MainButton
          text="Process Notifications"
          isLoading={loading}
          headIcon={<BellRing className="h-4 w-4" />}
          onClick={onRun}
        />
      </div>

      {result ? (
        <div className="mt-4 rounded-2xl bg-[#f7f8f3] p-4">
          <p className="text-sm font-semibold text-[#203321]">
            Processed with {result.daysBeforeExpiry} day reminder window
          </p>
          <p className="mt-1 text-sm text-[#74816f]">
            Expiring notifications: {result.expiringProcessed} · Expired access
            updates: {result.expiredProcessed}
          </p>
        </div>
      ) : null}
    </section>
  );
}
