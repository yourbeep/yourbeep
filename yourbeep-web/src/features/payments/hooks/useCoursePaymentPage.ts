import { useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { appRoutes } from "@constants/routes";
import { useAppDispatch, useAppSelector } from "@store";
import {
  clearPaymentNotice,
  confirmCourseCheckout,
  fetchCoursePaymentPage,
  initiateCourseCheckout,
  previewCoursePromotion,
  setPromotionCode,
  setSelectedPlan,
} from "@store/slices/payments";
import type {
  BillingPlanType,
  CheckoutMode,
} from "../services/paymentTypes";

const buildCheckoutUrls = (courseId: string, mode: CheckoutMode) => {
  const path = appRoutes.coursePricing(courseId);
  const origin = window.location.origin;

  return {
    successUrl: `${origin}${path}?checkout=success&mode=${mode}&session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: `${origin}${path}?checkout=cancelled&mode=${mode}`,
  };
};

export const useCoursePaymentPage = (courseId?: string) => {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const confirmAttemptRef = useRef<string | null>(null);
  const state = useAppSelector((store) => store.payments);

  useEffect(() => {
    if (!courseId) return;
    void dispatch(fetchCoursePaymentPage(courseId));
  }, [courseId, dispatch]);

  const checkoutMode: CheckoutMode = useMemo(() => {
    if (state.page?.access.hasAccess) {
      return "purchase";
    }

    if (state.page?.access.canRenew) {
      return "renew";
    }

    return "purchase";
  }, [state.page?.access.canRenew, state.page?.access.hasAccess]);

  useEffect(() => {
    if (!courseId) return;

    const checkoutStatus = searchParams.get("checkout");
    const sessionId = searchParams.get("session_id");
    const redirectMode =
      searchParams.get("mode") === "renew" ? "renew" : "purchase";

    if (
      checkoutStatus !== "success" ||
      !sessionId ||
      confirmAttemptRef.current === sessionId
    ) {
      return;
    }

    confirmAttemptRef.current = sessionId;
    void dispatch(
      confirmCourseCheckout({
        courseId,
        sessionId,
        mode: redirectMode,
      }),
    ).then(() => {
      void dispatch(fetchCoursePaymentPage(courseId));
    });
  }, [courseId, dispatch, searchParams]);

  const selectedPlanPrice = useMemo(() => {
    if (!state.page?.pricing) return 0;

    return state.selectedPlan === "annual"
      ? state.page.pricing.amount1yr
      : state.page.pricing.amount6mo;
  }, [state.page?.pricing, state.selectedPlan]);

  const selectedPlanLabel =
    state.selectedPlan === "annual" ? "1 year access" : "6 month access";

  const displaySelectedPlanPrice = useMemo(() => {
    if (!state.page?.pricing) return "";

    return state.selectedPlan === "annual"
      ? state.page.pricing.displayPrice1yr
      : state.page.pricing.displayPrice6mo;
  }, [state.page?.pricing, state.selectedPlan]);

  const effectiveAmount = state.preview?.finalAmount ?? selectedPlanPrice;

  const handlePlanChange = (plan: BillingPlanType) => {
    dispatch(setSelectedPlan(plan));
  };

  const handlePromotionCodeChange = (value: string) => {
    dispatch(setPromotionCode(value));
  };

  const handlePreviewPromotion = async () => {
    if (!courseId || !state.promotionCode.trim()) return;

    await dispatch(
      previewCoursePromotion({
        courseId,
        planType: state.selectedPlan,
        promotionCode: state.promotionCode,
      }),
    );
  };

  const handleCheckout = async () => {
    if (!courseId) return;

    const { successUrl, cancelUrl } = buildCheckoutUrls(courseId, checkoutMode);
    const result = await dispatch(
      initiateCourseCheckout({
        courseId,
        planType: state.selectedPlan,
        promotionCode: state.promotionCode,
        successUrl,
        cancelUrl,
        mode: checkoutMode,
      }),
    );

    if (initiateCourseCheckout.fulfilled.match(result)) {
      window.location.assign(result.payload.checkoutUrl);
    }
  };

  return {
    ...state,
    checkoutMode,
    checkoutStatus: searchParams.get("checkout"),
    displaySelectedPlanPrice,
    selectedPlanPrice,
    selectedPlanLabel,
    effectiveAmount,
    handlePlanChange,
    handlePromotionCodeChange,
    handlePreviewPromotion,
    handleCheckout,
    clearNotice: () => dispatch(clearPaymentNotice()),
  };
};
