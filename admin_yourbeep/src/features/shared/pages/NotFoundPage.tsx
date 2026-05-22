import { useNavigate } from "react-router-dom";
import { MdHome, MdPlayLesson } from "react-icons/md";

type NavCardProps = {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  onClick: () => void;
};

function NavCard({ icon: Icon, title, subtitle, onClick }: NavCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-2xl border border-black/8 bg-white px-5 py-4 text-left transition-all duration-200 hover:border-black/15 hover:shadow-sm active:scale-[0.99]"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black/6">
          <Icon className="text-[18px] text-black/60" />
        </div>
        <div>
          <p className="text-sm font-semibold text-black">{title}</p>
          <p className="text-xs text-black/40">{subtitle}</p>
        </div>
      </div>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        className="flex-shrink-0 text-black/25"
      >
        <path
          d="M6 3l5 5-5 5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#f0f0f0] px-4 selection:bg-black/20">
      {/* Faint concentric rings */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {[320, 480, 640, 800].map((size) => (
          <div
            key={size}
            className="absolute rounded-full border border-black/[0.06]"
            style={{
              width: size,
              height: size,
              top: -size / 2,
              left: -size / 2,
            }}
          />
        ))}
      </div>

      {/* Floating emoji decorations */}
      <span className="pointer-events-none absolute left-[calc(50%-260px)] top-[calc(50%-130px)] select-none text-4xl">
        🫧
      </span>
      <span className="pointer-events-none absolute left-[calc(50%+200px)] top-[calc(50%-110px)] select-none text-3xl">
        💜
      </span>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Eyebrow */}
        <p className="mb-3 text-sm text-black/40">You look a little lost…</p>

        {/* Heading */}
        <h1 className="text-[clamp(2.4rem,6vw,3.8rem)] font-bold leading-[1.05] tracking-tight text-black">
          Ooops! Page not found
        </h1>

        {/* Sub copy */}
        <p className="mt-4 max-w-[420px] text-[15px] leading-7 text-black/45">
          This page doesn't exist or was removed.{" "}
          <span className="rounded-md bg-black/8 px-1.5 py-0.5 font-medium text-black/70">
            Head back
          </span>{" "}
          to a safe spot below.
        </p>

        {/* UFO illustration area — soft purple glow + placeholder */}
        <div className="relative my-10 flex h-44 w-44 items-center justify-center">
          {/* Glow blob */}
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(160,100,255,0.28),transparent_70%)]" />
          {/* UFO emoji stand-in — swap for a real 3D asset if available */}
          <span className="select-none text-[88px] drop-shadow-sm">🛸</span>
          {/* Sparkle dots */}
          <span className="absolute left-3 top-8 text-xs text-violet-400">
            ✦
          </span>
          <span className="absolute bottom-8 right-2 text-xs text-violet-300">
            ✦
          </span>
          <span className="absolute bottom-6 left-8 text-[10px] text-violet-200">
            ✦
          </span>
        </div>

        {/* Nav cards */}
        <div className="flex w-full max-w-sm flex-col gap-3">
          <NavCard
            icon={MdHome}
            title="Home Page"
            subtitle="There's no place like home…"
            onClick={() => navigate("/")}
          />
          <NavCard
            icon={MdPlayLesson}
            title="Courses"
            subtitle="Browse all YourBeep courses"
            onClick={() => navigate("/courses")}
          />
        </div>
      </div>
    </main>
  );
}
