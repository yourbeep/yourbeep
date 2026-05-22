import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import PrimaryButton from "@components/common/PrimaryButton";
import { appRoutes } from "@constants/routes";
import MainPageShell from "@features/main/components/MainPageShell";
import CheckoutBanner from "../components/CheckoutBanner";
import PlanSelector from "../components/PlanSelector";
import PricingFeatureList from "../components/PricingFeatureList";
import PromotionForm from "../components/PromotionForm";
import PurchaseSummaryCard from "../components/PurchaseSummaryCard";
import { useCoursePaymentPage } from "../hooks/useCoursePaymentPage";

const Coursepricing = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const {
    page,
    loading,
    error,
    selectedPlan,
    promotionCode,
    preview,
    notice,
    previewing,
    checkingOut,
    checkoutMode,
    checkoutStatus,
    displaySelectedPlanPrice,
    selectedPlanLabel,
    handlePlanChange,
    handlePromotionCodeChange,
    handlePreviewPromotion,
    handleCheckout,
    clearNotice,
  } = useCoursePaymentPage(courseId);

  if (loading) {
    return (
      <MainPageShell activeItem="Courses">
        <div className="rounded-[28px] bg-white px-8 py-16 text-center text-sm text-[#617273] shadow-sm">
          Loading secure pricing and checkout details...
        </div>
      </MainPageShell>
    );
  }

  if (error || !page) {
    return (
      <MainPageShell activeItem="Courses">
        <div className="rounded-[28px] bg-white px-8 py-16 text-center shadow-sm">
          <p className="text-base font-semibold text-[#1a2e38]">
            We couldn&apos;t load this payment page.
          </p>
          <p className="mt-2 text-sm text-[#667577]">
            {error || "The course pricing is unavailable right now."}
          </p>
        </div>
      </MainPageShell>
    );
  }

  return (
    <MainPageShell activeItem="Courses">
      <button
        type="button"
        onClick={() => navigate(appRoutes.courseDetail(page.course.id))}
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#456772] transition hover:text-[#1a4a58]"
      >
        <ArrowLeft size={16} />
        Back to course details
      </button>

      <CheckoutBanner notice={notice} onDismiss={clearNotice} />

      {checkoutStatus === "cancelled" ? (
        <div className="mb-6 rounded-2xl border border-[#e7dbc8] bg-[#f9f1e4] px-5 py-4 text-sm text-[#8a6940]">
          Your Stripe checkout was cancelled. Your course access has not been
          changed yet.
        </div>
      ) : null}

      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="overflow-hidden rounded-[32px] bg-[#d9ddd4]">
            <img
              src={page.course.thumbnail}
              alt={page.course.title}
              className="h-[280px] w-full object-cover md:h-[340px]"
            />
          </div>

          <div className="mt-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6b8a90]">
              Secure course access
            </p>
            <h1 className="mt-3 text-[38px] font-bold leading-tight text-[#1a2e38] md:text-[48px]">
              {page.course.title}
            </h1>
            <p className="mt-3 text-[14px] font-semibold uppercase tracking-[0.14em] text-[#6d8a8f]">
              {page.course.subtitle}
            </p>
            <p className="mt-5 max-w-[760px] text-[15px] leading-8 text-[#5c6e70]">
              {page.course.description}
            </p>
          </div>

          <div className="mt-8">
            <PlanSelector
              pricing={page.pricing}
              selectedPlan={selectedPlan}
              onChange={handlePlanChange}
            />
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
            <PromotionForm
              value={promotionCode}
              onChange={handlePromotionCodeChange}
              onApply={handlePreviewPromotion}
              loading={previewing}
            />
            <PricingFeatureList
              gamesCount={page.course.gamesCount}
              durationMinutes={page.course.durationMinutes}
            />
          </div>

          <div className="mt-6 rounded-[28px] border border-[#e6dfd2] bg-white p-6">
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#6d8a8f]">
              Payment flow
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {[
                {
                  title: "Choose your plan",
                  body: "Select 6 month or 1 year access based on the pace you want to move through the material.",
                },
                {
                  title: "Go to Stripe",
                  body: "We create a Stripe Checkout session using the backend pricing and promotion rules for your region.",
                },
                {
                  title: "Return and confirm",
                  body: "After payment, you return here and we confirm access automatically with the backend.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-[20px] bg-[#f7f6f1] px-5 py-5"
                >
                  <h3 className="text-[15px] font-bold text-[#1a2e38]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#617273]">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="sticky top-6">
            <PurchaseSummaryCard
              pricing={page.pricing}
              selectedPlanLabel={selectedPlanLabel}
              displaySelectedPlanPrice={displaySelectedPlanPrice}
              preview={preview}
              access={page.access}
              checkoutMode={checkoutMode}
              checkingOut={checkingOut}
              onCheckout={handleCheckout}
            />

            <div className="mt-5 rounded-[24px] border border-[#e6dfd2] bg-white p-5">
              <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#6d8a8f]">
                Need context first?
              </p>
              <p className="mt-2 text-sm leading-6 text-[#617273]">
                You can still revisit the full course overview before committing
                to checkout.
              </p>
              <PrimaryButton
                variant="outline"
                onClick={() => navigate(appRoutes.courseDetail(page.course.id))}
                fullWidth
                className="mt-4 py-3 text-[12px] font-semibold uppercase tracking-[0.16em]"
              >
                View Course Details
              </PrimaryButton>
            </div>
          </div>
        </div>
      </section>
    </MainPageShell>
  );
};

export default Coursepricing;
