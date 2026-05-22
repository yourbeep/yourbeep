import { useMemo, useState } from "react";
import type { TestimonialItem } from "../../../store/slices/testimonials";
import {
  buildTestimonialPayload,
  createEmptyTestimonialForm,
  createTestimonialFormFromItem,
  type TestimonialFormValues,
} from "../types";

export function useTestimonialForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<TestimonialItem | null>(null);
  const [form, setForm] = useState<TestimonialFormValues>(
    createEmptyTestimonialForm(),
  );

  const openCreate = () => {
    setEditing(null);
    setForm(createEmptyTestimonialForm());
    setIsOpen(true);
  };

  const openEdit = (testimonial: TestimonialItem) => {
    setEditing(testimonial);
    setForm(createTestimonialFormFromItem(testimonial));
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setEditing(null);
  };

  const payload = useMemo(() => buildTestimonialPayload(form), [form]);

  return { isOpen, editing, form, setForm, openCreate, openEdit, close, payload };
}
