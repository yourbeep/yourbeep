const TestimonialFormPanel = ({
  isOpen,
  title,
  form,
  setForm,
  courses,
  editing,
  loading,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 p-4">
      <div className="w-full max-w-3xl rounded-[28px] bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.22)]">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold text-[#203321]">{title}</h3>
            <p className="mt-1 text-sm text-[#74816f]">
              Create or moderate a testimonial using the backend moderation model.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#d8e3d2] bg-[#f7f8f3] px-3 py-2 text-sm font-semibold text-[#304132]"
          >
            Close
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <input
            value={form.displayName}
            onChange={(event) => setForm((current) => ({ ...current, displayName: event.target.value }))}
            placeholder="Display name"
            className="rounded-xl border border-[#d8e3d2] px-4 py-2.5 text-sm text-[#304132] outline-none focus:border-[#7ca36f]"
          />
          <input
            value={form.roleLabel}
            onChange={(event) => setForm((current) => ({ ...current, roleLabel: event.target.value }))}
            placeholder="Role label, e.g. Learner"
            className="rounded-xl border border-[#d8e3d2] px-4 py-2.5 text-sm text-[#304132] outline-none focus:border-[#7ca36f]"
          />
          <input
            value={form.avatar}
            onChange={(event) => setForm((current) => ({ ...current, avatar: event.target.value }))}
            placeholder="Avatar URL"
            className="rounded-xl border border-[#d8e3d2] px-4 py-2.5 text-sm text-[#304132] outline-none focus:border-[#7ca36f]"
          />
          <input
            value={form.headline}
            onChange={(event) => setForm((current) => ({ ...current, headline: event.target.value }))}
            placeholder="Headline"
            className="rounded-xl border border-[#d8e3d2] px-4 py-2.5 text-sm text-[#304132] outline-none focus:border-[#7ca36f]"
          />
          <select
            value={form.courseId}
            onChange={(event) => setForm((current) => ({ ...current, courseId: event.target.value }))}
            className="rounded-xl border border-[#d8e3d2] px-3 py-2.5 text-sm text-[#304132] outline-none focus:border-[#7ca36f]"
          >
            <option value="">General platform testimonial</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.title}
              </option>
            ))}
          </select>
          <select
            value={form.status}
            onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}
            className="rounded-xl border border-[#d8e3d2] px-3 py-2.5 text-sm text-[#304132] outline-none focus:border-[#7ca36f]"
          >
            {["pending", "approved", "rejected", "hidden"].map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
          <div className="md:col-span-2">
            <textarea
              value={form.quote}
              onChange={(event) => setForm((current) => ({ ...current, quote: event.target.value }))}
              rows={5}
              placeholder="Testimonial quote"
              className="w-full rounded-2xl border border-[#d8e3d2] px-4 py-3 text-sm text-[#304132] outline-none focus:border-[#7ca36f]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#304132]">Rating</label>
            <input
              type="number"
              min={1}
              max={5}
              value={form.rating}
              onChange={(event) => setForm((current) => ({ ...current, rating: Number(event.target.value) }))}
              className="w-full rounded-xl border border-[#d8e3d2] px-4 py-2.5 text-sm text-[#304132] outline-none focus:border-[#7ca36f]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#304132]">Featured order</label>
            <input
              value={form.featuredOrder}
              onChange={(event) => setForm((current) => ({ ...current, featuredOrder: event.target.value }))}
              placeholder="Optional number"
              className="w-full rounded-xl border border-[#d8e3d2] px-4 py-2.5 text-sm text-[#304132] outline-none focus:border-[#7ca36f]"
            />
          </div>
          <label className="md:col-span-2 flex items-center gap-2 text-sm text-[#445342]">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(event) => setForm((current) => ({ ...current, featured: event.target.checked }))}
            />
            Feature this testimonial publicly
          </label>
          <div className="md:col-span-2">
            <textarea
              value={form.adminNotes}
              onChange={(event) => setForm((current) => ({ ...current, adminNotes: event.target.value }))}
              rows={3}
              placeholder="Admin notes"
              className="w-full rounded-2xl border border-[#d8e3d2] px-4 py-3 text-sm text-[#304132] outline-none focus:border-[#7ca36f]"
            />
          </div>
          <div className="md:col-span-2">
            <textarea
              value={form.rejectionReason}
              onChange={(event) =>
                setForm((current) => ({ ...current, rejectionReason: event.target.value }))
              }
              rows={3}
              placeholder="Rejection reason (optional)"
              className="w-full rounded-2xl border border-[#d8e3d2] px-4 py-3 text-sm text-[#304132] outline-none focus:border-[#7ca36f]"
            />
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#d8e3d2] bg-[#f7f8f3] px-4 py-2.5 text-sm font-semibold text-[#304132]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={loading}
            className="rounded-xl bg-[#335c38] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {editing ? "Save Changes" : "Create Testimonial"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestimonialFormPanel;
