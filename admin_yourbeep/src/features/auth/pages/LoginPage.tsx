import LoginForm from "../components/LoginForm";

const loginSteps = [
  { number: 1, title: "Authenticate your access", active: true },
  { number: 2, title: "Review workspace controls", active: false },
  { number: 3, title: "Enter the admin dashboard", active: false },
];

type StepItemProps = {
  number: number;
  text: string;
  active: boolean;
};

function StepItem({ number, text, active }: StepItemProps) {
  return (
    <div
      className={`flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
        active
          ? "border border-[var(--primary)] bg-[var(--primary)] text-white shadow-[0_10px_24px_rgba(13,110,110,0.18)]"
          : "bg-white/55 text-black/70 backdrop-blur-sm"
      }`}
    >
      <span
        className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
          active ? "bg-white text-[var(--primary)]" : "bg-black/10 text-black/40"
        }`}
      >
        {number}
      </span>
      {text}
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen w-full bg-[#eef5ea] p-2 text-black selection:bg-[var(--primary)]/20 lg:h-screen lg:overflow-hidden lg:p-4">
      <section className="relative hidden h-full w-[52%] flex-col overflow-hidden rounded-3xl px-12 py-12 lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(103,162,116,0.38),transparent_70%),radial-gradient(ellipse_60%_50%_at_15%_30%,rgba(61,121,77,0.24),transparent_60%),linear-gradient(180deg,#f5fbf2_0%,#e3f1db_42%,#cfe6c4_100%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')]" />

        <div className="relative z-10 flex h-full flex-col justify-between">
          <div>
            <img
              src="/app_logo.png"
              alt="YourBeep"
              className="h-14 w-auto object-contain object-left"
            />
          </div>

          <div className="flex flex-col gap-8 pb-8">
            <div>
              <h1 className="text-[42px] font-semibold leading-[1.08] tracking-tight text-black">
                Welcome back
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-black/50">
                Follow these 3 quick phases to enter your workspace.
              </p>
            </div>

            <div className="flex flex-col gap-2.5">
              {loginSteps.map((step) => (
                <StepItem
                  key={step.number}
                  number={step.number}
                  text={step.title}
                  active={step.active}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-1 items-center justify-center overflow-y-auto rounded-3xl bg-[linear-gradient(180deg,#f9fcf8_0%,#f1f7ed_100%)] px-4 py-10 sm:px-8 lg:px-14">
        <LoginForm />
      </section>
    </main>
  );
}
