import { audienceLabel } from "../services/notificationFormatters";

const campaignTypes = [
  "course_ready",
  "game_added",
  "game_reminder",
  "purchase_confirmed",
  "subscription_expiring",
  "subscription_expired",
  "admin_broadcast",
];

const audienceTypes = [
  "all_users",
  "premium_users",
  "course_purchasers",
  "specific_users",
  "region_users",
];

const NotificationCampaignFormPanel = ({
  isOpen,
  title,
  form,
  setForm,
  dataIsValid,
  courses,
  editingCampaign,
  onPreview,
  onClose,
  onSubmit,
  preview,
  previewLoading,
  loading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/25 p-4">
      <div className="flex h-full w-full max-w-5xl flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_24px_80px_rgba(15,23,42,0.22)] lg:flex-row">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold text-[#203321]">{title}</h3>
              <p className="mt-1 text-sm text-[#74816f]">
                Build the payload exactly around the backend campaign and audience contract.
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

          <div className="grid gap-4">
            <input
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              placeholder="Campaign title"
              className="rounded-xl border border-[#d8e3d2] px-4 py-2.5 text-sm text-[#304132] outline-none focus:border-[#7ca36f]"
            />
            <textarea
              value={form.body}
              onChange={(event) => setForm((current) => ({ ...current, body: event.target.value }))}
              rows={5}
              placeholder="Campaign message body"
              className="rounded-2xl border border-[#d8e3d2] px-4 py-3 text-sm text-[#304132] outline-none focus:border-[#7ca36f]"
            />
            <input
              value={form.imageUrl}
              onChange={(event) => setForm((current) => ({ ...current, imageUrl: event.target.value }))}
              placeholder="Optional image URL"
              className="rounded-xl border border-[#d8e3d2] px-4 py-2.5 text-sm text-[#304132] outline-none focus:border-[#7ca36f]"
            />

            <div className="grid gap-4 md:grid-cols-2">
              <select
                value={form.type}
                onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))}
                className="rounded-xl border border-[#d8e3d2] px-3 py-2.5 text-sm text-[#304132] outline-none focus:border-[#7ca36f]"
              >
                {campaignTypes.map((item) => (
                  <option key={item} value={item}>
                    {audienceLabel(item)}
                  </option>
                ))}
              </select>
              <select
                value={form.audienceType}
                onChange={(event) => setForm((current) => ({ ...current, audienceType: event.target.value }))}
                className="rounded-xl border border-[#d8e3d2] px-3 py-2.5 text-sm text-[#304132] outline-none focus:border-[#7ca36f]"
              >
                {audienceTypes.map((item) => (
                  <option key={item} value={item}>
                    {audienceLabel(item)}
                  </option>
                ))}
              </select>
            </div>

            {form.audienceType === "course_purchasers" ? (
              <select
                value={form.courseId}
                onChange={(event) => setForm((current) => ({ ...current, courseId: event.target.value }))}
                className="rounded-xl border border-[#d8e3d2] px-3 py-2.5 text-sm text-[#304132] outline-none focus:border-[#7ca36f]"
              >
                <option value="">Select course</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.title}
                  </option>
                ))}
              </select>
            ) : null}

            {form.audienceType === "specific_users" ? (
              <textarea
                value={form.userIdsText}
                onChange={(event) =>
                  setForm((current) => ({ ...current, userIdsText: event.target.value }))
                }
                rows={3}
                placeholder="Comma-separated user ids"
                className="rounded-2xl border border-[#d8e3d2] px-4 py-3 text-sm text-[#304132] outline-none focus:border-[#7ca36f]"
              />
            ) : null}

            {form.audienceType === "region_users" ? (
              <input
                value={form.regionsText}
                onChange={(event) =>
                  setForm((current) => ({ ...current, regionsText: event.target.value }))
                }
                placeholder="Comma-separated region codes, e.g. IN, US"
                className="rounded-xl border border-[#d8e3d2] px-4 py-2.5 text-sm text-[#304132] outline-none focus:border-[#7ca36f]"
              />
            ) : null}

            <textarea
              value={form.dataText}
              onChange={(event) => setForm((current) => ({ ...current, dataText: event.target.value }))}
              rows={5}
              placeholder='Optional JSON data payload, e.g. { "screen": "orders" }'
              className={`rounded-2xl border px-4 py-3 text-sm text-[#304132] outline-none focus:border-[#7ca36f] ${
                dataIsValid ? "border-[#d8e3d2]" : "border-[#e8b0a6] bg-[#fff7f6]"
              }`}
            />

            {!editingCampaign ? (
              <label className="flex items-center gap-2 text-sm text-[#445342]">
                <input
                  type="checkbox"
                  checked={form.sendNow}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, sendNow: event.target.checked }))
                  }
                />
                Send immediately after creating
              </label>
            ) : null}
          </div>
        </div>

        <div className="w-full border-t border-[#edf0e7] bg-[#fbfcf8] p-6 lg:w-[360px] lg:border-l lg:border-t-0">
          <h4 className="text-lg font-bold text-[#203321]">Audience Preview</h4>
          <p className="mt-1 text-sm text-[#74816f]">
            Validate who will receive this campaign before you save or send it.
          </p>

          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={onPreview}
              disabled={previewLoading || !dataIsValid}
              className="rounded-xl bg-[#335c38] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              Preview Audience
            </button>
            <button
              type="button"
              onClick={onSubmit}
              disabled={loading || !dataIsValid}
              className="rounded-xl border border-[#d8e3d2] bg-white px-4 py-2.5 text-sm font-semibold text-[#304132] disabled:opacity-60"
            >
              {editingCampaign ? "Save Draft" : form.sendNow ? "Create & Send" : "Create Draft"}
            </button>
          </div>

          {!dataIsValid ? (
            <div className="mt-4 rounded-2xl border border-[#f0d5cf] bg-[#fff7f6] px-4 py-3 text-sm text-[#b35d4c]">
              Fix the JSON payload before previewing or saving this campaign.
            </div>
          ) : null}

          <div className="mt-5 space-y-3">
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#83907e]">
                Targeted Users
              </p>
              <p className="mt-2 text-3xl font-bold text-[#203321]">
                {Number(preview?.targetedUsers || 0).toLocaleString()}
              </p>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#83907e]">
                Targeted Tokens
              </p>
              <p className="mt-2 text-3xl font-bold text-[#203321]">
                {Number(preview?.targetedTokens || 0).toLocaleString()}
              </p>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#83907e]">
                Sample Users
              </p>
              <div className="mt-3 space-y-3">
                {preview?.sampleUsers?.length ? (
                  preview.sampleUsers.map((user) => (
                    <div key={user._id} className="rounded-xl bg-[#f7f8f3] px-3 py-2">
                      <p className="text-sm font-semibold text-[#203321]">{user.name}</p>
                      <p className="mt-1 text-xs text-[#74816f]">{user.email}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-[#74816f]">
                    Preview the audience to see sample recipients.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCampaignFormPanel;
