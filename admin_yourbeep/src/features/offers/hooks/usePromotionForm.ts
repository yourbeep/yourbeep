import { useMemo, useState } from "react";
import type { PromotionItem } from "../../../store/slices/offers";
import {
  buildPromotionPayload,
  getDefaultPromotionForm,
  mapPromotionToForm,
  type PromotionFormState,
} from "../services/promotionAdminApi";

export const usePromotionForm = () => {
  const [editingPromotion, setEditingPromotion] = useState<PromotionItem | null>(
    null,
  );
  const [form, setForm] = useState<PromotionFormState>(getDefaultPromotionForm());
  const [isOpen, setIsOpen] = useState(false);

  const title = useMemo(
    () => (editingPromotion ? "Edit Promotion" : "Create Promotion"),
    [editingPromotion],
  );

  const openCreate = () => {
    setEditingPromotion(null);
    setForm(getDefaultPromotionForm());
    setIsOpen(true);
  };

  const openEdit = (promotion: PromotionItem) => {
    setEditingPromotion(promotion);
    setForm(mapPromotionToForm(promotion));
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setEditingPromotion(null);
  };

  const togglePlanType = (planType: "six_month" | "annual") => {
    setForm((current) => {
      const exists = current.planTypes.includes(planType);
      const nextPlanTypes = exists
        ? current.planTypes.filter((item) => item !== planType)
        : [...current.planTypes, planType];

      return {
        ...current,
        planTypes: nextPlanTypes.length ? nextPlanTypes : current.planTypes,
      };
    });
  };

  const payload = useMemo(() => buildPromotionPayload(form), [form]);

  return {
    editingPromotion,
    form,
    setForm,
    isOpen,
    title,
    openCreate,
    openEdit,
    close,
    togglePlanType,
    payload,
  };
};
