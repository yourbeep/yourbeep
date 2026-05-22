const inputClassName =
  "w-full rounded-2xl border border-[#dfe8d6] bg-[#fbfcf8] px-4 py-3 text-sm text-[#203321] outline-none transition focus:border-[#0d6e6e] focus:bg-white";

const PromotionFormPanel = ({
  isOpen,
  title,
  form,
  setForm,
  togglePlanType,
  courses,
  onClose,
  onSubmit,
  loading,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/25 p-4">
      <div className="h-full w-full max-w-2xl overflow-y-auto rounded-[28px] border border-[#e7eadf] bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#203321]">{title}</h2>
            <p className="mt-1 text-sm text-[#74816f]">
              Match the backend fields exactly so Stripe and applicability rules stay valid.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-[#dfe8d6] bg-white px-4 py-2 text-sm font-semibold text-[#314330] transition hover:bg-[#f7faf2]"
          >
            Close
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#314330]">Name</label>
              <input
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                className={inputClassName}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#314330]">Code</label>
              <input
                value={form.code}
                onChange={(event) => setForm((current) => ({ ...current, code: event.target.value }))}
                className={inputClassName}
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#314330]">Description</label>
            <textarea
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({ ...current, description: event.target.value }))
              }
              className={`${inputClassName} min-h-[90px] resize-y`}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#314330]">Course</label>
              <select
                value={form.courseId}
                onChange={(event) => setForm((current) => ({ ...current, courseId: event.target.value }))}
                className={inputClassName}
              >
                <option value="">Global promotion</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#314330]">Regions</label>
              <input
                value={form.regions}
                onChange={(event) => setForm((current) => ({ ...current, regions: event.target.value }))}
                placeholder="IN, US"
                className={inputClassName}
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#314330]">Discount type</label>
              <select
                value={form.discountType}
                onChange={(event) =>
                  setForm((current) => ({ ...current, discountType: event.target.value }))
                }
                className={inputClassName}
              >
                <option value="percentage">Percentage</option>
                <option value="fixed_amount">Fixed amount</option>
              </select>
            </div>
            {form.discountType === "percentage" ? (
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#314330]">Percentage off</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={form.percentageOff}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, percentageOff: event.target.value }))
                  }
                  className={inputClassName}
                />
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#314330]">Amount off</label>
                  <input
                    type="number"
                    min="1"
                    value={form.amountOff}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, amountOff: event.target.value }))
                    }
                    className={inputClassName}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#314330]">Currency</label>
                  <input
                    value={form.currency}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, currency: event.target.value }))
                    }
                    className={inputClassName}
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#314330]">Plan types</label>
            <div className="flex flex-wrap gap-3">
              {[
                { label: "6 month", value: "six_month" },
                { label: "Annual", value: "annual" },
              ].map((plan) => (
                <label
                  key={plan.value}
                  className="inline-flex items-center gap-2 rounded-full border border-[#dfe8d6] bg-[#fbfcf8] px-4 py-2 text-sm font-medium text-[#314330]"
                >
                  <input
                    type="checkbox"
                    checked={form.planTypes.includes(plan.value)}
                    onChange={() => togglePlanType(plan.value)}
                    className="h-4 w-4 accent-[var(--primary)]"
                  />
                  {plan.label}
                </label>
              ))}
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#314330]">Starts at</label>
              <input
                type="date"
                value={form.startsAt}
                onChange={(event) => setForm((current) => ({ ...current, startsAt: event.target.value }))}
                className={inputClassName}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#314330]">Ends at</label>
              <input
                type="date"
                value={form.endsAt}
                onChange={(event) => setForm((current) => ({ ...current, endsAt: event.target.value }))}
                className={inputClassName}
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#314330]">Max redemptions</label>
              <input
                type="number"
                min="1"
                value={form.maxRedemptions}
                onChange={(event) =>
                  setForm((current) => ({ ...current, maxRedemptions: event.target.value }))
                }
                className={inputClassName}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#314330]">Per user limit</label>
              <input
                type="number"
                min="1"
                value={form.perUserLimit}
                onChange={(event) =>
                  setForm((current) => ({ ...current, perUserLimit: event.target.value }))
                }
                className={inputClassName}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-5">
            <label className="flex items-center gap-3 text-sm font-medium text-[#314330]">
              <input
                type="checkbox"
                checked={form.autoApply}
                onChange={(event) =>
                  setForm((current) => ({ ...current, autoApply: event.target.checked }))
                }
                className="h-4 w-4 accent-[var(--primary)]"
              />
              Auto apply
            </label>
            <label className="flex items-center gap-3 text-sm font-medium text-[#314330]">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(event) =>
                  setForm((current) => ({ ...current, isActive: event.target.checked }))
                }
                className="h-4 w-4 accent-[var(--primary)]"
              />
              Active
            </label>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-[#dfe8d6] bg-white px-5 py-3 text-sm font-semibold text-[#314330] transition hover:bg-[#f7faf2]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={loading}
            className="rounded-2xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--primary-dark)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Promotion"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromotionFormPanel;
