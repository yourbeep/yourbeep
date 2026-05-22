import { useState } from "react";
import MainButton from "@components/ui/MainButton";
import { reflectActionOptions } from "../services/reflectConfig";
import type { GameSubmissionPayload } from "../../services/gameExperienceTypes";

type ReflectGameFormProps = {
  courseId: string;
  submitting: boolean;
  onSubmit: (payload: GameSubmissionPayload) => Promise<unknown>;
};

const ReflectGameForm = ({
  courseId,
  submitting,
  onSubmit,
}: ReflectGameFormProps) => {
  const [notes, setNotes] = useState("");
  const [action, setAction] = useState("acceptance");

  const submit = async () => {
    const payload: GameSubmissionPayload = {
      type: "reflect_act",
      courseId,
      payload: {
        userReflectionNotes: notes.trim() || undefined,
        acknowledgedAction: action || undefined,
      },
    };

    await onSubmit(payload);
  };

  return (
    <div className="rounded-[28px] bg-white p-6 shadow-sm">
      <h2 className="text-[28px] font-bold text-[#1a2e38]">Reflect & Act</h2>
      <p className="mt-3 text-sm leading-7 text-[#5f7172]">
        This stage pulls together your earlier game outcomes and helps you
        translate them into a practical next action.
      </p>

      <div className="mt-6 space-y-5">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-[#27464c]">
            Reflection notes
          </span>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={6}
            placeholder="What are you noticing in yourself right now?"
            className="w-full rounded-2xl border border-[#d8dfdc] bg-[#f6f8f7] px-4 py-3 text-sm leading-7 text-[#244046] outline-none"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-[#27464c]">
            Acknowledged action
          </span>
          <select
            value={action}
            onChange={(event) => setAction(event.target.value)}
            className="w-full rounded-2xl border border-[#d8dfdc] bg-[#f6f8f7] px-4 py-3 text-sm text-[#244046] outline-none"
          >
            {reflectActionOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <MainButton
        onClick={() => void submit()}
        disabled={submitting}
        className="mt-8"
      >
        {submitting ? "Saving..." : "Complete reflection"}
      </MainButton>
    </div>
  );
};

export default ReflectGameForm;
