import { useEffect, useState } from "react";

export const useRefundForm = (order) => {
  const [form, setForm] = useState({
    reason: "requested_by_customer",
    notes: "",
    partialAmount: "",
  });

  useEffect(() => {
    setForm({
      reason: "requested_by_customer",
      notes: "",
      partialAmount: order?.amountPaid ? String(order.amountPaid) : "",
    });
  }, [order]);

  return { form, setForm };
};
