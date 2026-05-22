import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Info } from "lucide-react";

export default function HeadFlexibilityCheck() {
  const [rigidity, setRigidity] = useState(38);

  return (
    <div className="rounded-[30px] border border-[var(--border)] bg-white p-6">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
          Flexibility check
        </p>
        <h4 className="mt-2 text-2xl font-semibold text-[var(--text)]">
          Can the head shift perspective?
        </h4>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">
          Assess whether attention can move, reorient, and loosen, or whether the system is locking
          into one rigid loop.
        </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.96fr_1.04fr]">
        <div className="rounded-[24px] bg-[linear-gradient(180deg,#17323a_0%,#1f4651_100%)] p-5 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
            Somatic rigidity
          </p>
          <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/15">
            <motion.div
              className="h-full rounded-full bg-[linear-gradient(90deg,#5fd3aa_0%,#ebb65e_58%,#df6b56_100%)]"
              initial={{ width: 0 }}
              animate={{ width: `${rigidity}%` }}
              transition={{ duration: 0.45 }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.14em] text-white/75">
            <span>Fluid</span>
            <span>Rigid</span>
          </div>
          <input
            type="range"
            min={5}
            max={95}
            value={rigidity}
            onChange={(event) => setRigidity(Number(event.target.value))}
            className="mt-6 w-full cursor-pointer accent-[#5fd3aa]"
          />
        </div>

        <div className="space-y-4">
          <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-5">
            <p className="text-sm font-semibold text-[var(--text)]">Guided investigation</p>
            <div className="mt-4 space-y-3">
              {[
                "Can you generate two alternative perspectives on the same issue?",
                "Can you pause mid-sentence while explaining your frustration?",
                "Can you feel the body while the mind stays with the story?",
              ].map((item, index) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-semibold text-[var(--primary)]">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-6 text-[var(--muted)]">{item}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-start gap-3 rounded-[18px] bg-white p-3">
              <Info size={16} className="mt-0.5 text-[var(--primary)]" />
              <p className="text-sm leading-6 text-[var(--muted)]">
                The goal is not to solve the issue, but to observe your structural capacity to shift
                away from it.
              </p>
            </div>
          </div>

          <div className="rounded-[24px] border border-[#f1d5cf] bg-[#fff6f3] p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white text-[#de6b57]">
                <AlertTriangle size={16} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#b34d41]">Limbic overdrive warning</p>
                <p className="mt-1 text-sm leading-6 text-[#8d645b]">
                  If these questions feel physically difficult or trigger immediate frustration, the
                  system may be in a limbic lock. Ground before moving forward.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
