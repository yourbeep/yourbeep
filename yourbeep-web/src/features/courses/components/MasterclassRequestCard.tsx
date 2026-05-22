import { motion } from "framer-motion";
import { useState } from "react";
import MainButton from "@components/ui/MainButton";
import MainInput from "@components/ui/MainInput";
import StatusPill from "@components/ui/StatusPill";
import showToast from "@utils/showToast";

const avatars = [
  { label: "AM", style: { background: "#2f6e76" } },
  { label: "SK", style: { background: "#587a63" } },
  { label: "RN", style: { background: "#b27b58" } },
];

export default function MasterclassRequestCard() {
  const [email, setEmail] = useState("");

  const handleRequest = () => {
    if (!email.trim()) {
      showToast({
        type: "warning",
        message: "Add your email first",
        options: {
          description:
            "Enter your best email so we can send the next free masterclass invite.",
        },
      });
      return;
    }

    showToast({
      type: "success",
      message: "You're on the list",
      options: {
        description:
          "We'll send the next free masterclass invite and course updates there.",
      },
    });
    setEmail("");
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-[32px] border border-[rgba(39,107,115,0.12)] bg-[linear-gradient(135deg,#f7f4eb_0%,#edf3ec_45%,#e1ece6_100%)] px-7 py-10 shadow-[0_20px_50px_rgba(39,107,115,0.08)] md:px-12 md:py-12"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-10 top-0 h-full w-[42%] bg-[radial-gradient(circle_at_top,rgba(39,107,115,0.15),transparent_55%)]" />
        <div className="absolute right-10 top-8 h-24 w-24 rounded-full bg-white/60 blur-2xl" />
        <div className="absolute right-28 top-20 h-36 w-36 rounded-full bg-[rgba(39,107,115,0.10)] blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[220px] w-[240px] bg-[radial-gradient(circle_at_bottom_right,rgba(219,111,74,0.16),transparent_60%)]" />
        <div className="absolute bottom-0 right-10 h-[180px] w-[150px]">
          {[36, 72, 104, 136].map((left, index) => (
            <div
              key={left}
              className="absolute bottom-0 w-[3px] rounded-full bg-[linear-gradient(to_top,#6f9172,#a9c5a8)]"
              style={{
                left,
                height: [130, 160, 120, 148][index],
                transform: `rotate(${[-4, 6, -8, 5][index]}deg)`,
                transformOrigin: "bottom center",
              }}
            >
              <div className="absolute left-1/2 top-[-18px] -translate-x-1/2 rounded-full bg-[rgba(223,185,216,0.95)] px-2 py-1 text-[8px] text-transparent shadow-[0_2px_10px_rgba(0,0,0,0.04)]" />
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-[2] max-w-[520px]">
        <StatusPill tone="primary" className="mb-4">
          Free Masterclass
        </StatusPill>
        <h2
          className="mb-3 text-[2rem] font-bold tracking-[-0.03em] text-[#1a2e38] md:text-[2.2rem]"
          style={{ fontFamily: '"Sora", "DM Sans", sans-serif' }}
        >
          Attend your free masterclass
        </h2>
        <p className="mb-7 max-w-[420px] text-[0.95rem] leading-[1.75] text-[#587075]">
          Receive our quarterly journal, early access to enrolment, and gentle
          invitations into the next reflective learning spaces we open.
        </p>

        <div className="mb-5 flex flex-wrap items-center gap-3">
          <MainInput
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Your email address"
            wrapperClassName="min-w-[220px] flex-1"
            inputClassName="rounded-full border-white/80 bg-white/88 px-5 text-[0.9rem] shadow-[0_6px_20px_rgba(0,0,0,0.05)] placeholder:text-[#8aa0a3]"
          />
          <MainButton
            type="button"
            onClick={handleRequest}
            className="px-7 text-[0.9rem] shadow-[0_10px_24px_rgba(39,107,115,0.18)]"
          >
            Subscribe
          </MainButton>
        </div>

        <div className="flex items-center gap-[10px]">
          <div className="flex">
            {avatars.map((avatar, index) => (
              <div
                key={`contact-${avatar.label}`}
                className={`flex h-[30px] w-[30px] items-center justify-center rounded-full border-2 border-white/90 text-[10px] font-bold ${index === 0 ? "" : "-ml-2"}`}
                style={{ ...avatar.style, color: "white" }}
              >
                {avatar.label}
              </div>
            ))}
          </div>
          <span className="text-[0.8rem] font-semibold text-[#1a2e38]">
            Join thousands already learning with us
          </span>
        </div>
      </div>
    </motion.section>
  );
}
