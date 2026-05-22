const AuthBrandPanel = () => {
  return (
    <div
      className="relative hidden flex-col justify-between overflow-hidden px-12 py-14 lg:flex lg:w-[48%]"
      style={{
        backgroundImage:
          "linear-gradient(145deg, rgba(16,32,38,0.78) 0%, rgba(34,72,78,0.62) 48%, rgba(70,118,110,0.45) 100%), url('/auth_page/bg.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "200px 200px",
        }}
      />

      <div className="relative flex items-center gap-4">
        <div className="flex h-[72px] w-[72px] items-center justify-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm">
          <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
            <path
              d="M19 3 L33 11 L33 27 L19 35 L5 27 L5 11 Z"
              stroke="#4dd9ac"
              strokeWidth="1.5"
              fill="none"
            />
            <circle cx="19" cy="19" r="5" fill="#4dd9ac" opacity="0.8" />
            <circle cx="19" cy="8" r="2" fill="#4dd9ac" opacity="0.5" />
            <circle cx="28" cy="13" r="2" fill="#4dd9ac" opacity="0.5" />
            <circle cx="28" cy="25" r="2" fill="#4dd9ac" opacity="0.5" />
            <circle cx="19" cy="30" r="2" fill="#4dd9ac" opacity="0.5" />
            <circle cx="10" cy="25" r="2" fill="#4dd9ac" opacity="0.5" />
            <circle cx="10" cy="13" r="2" fill="#4dd9ac" opacity="0.5" />
          </svg>
        </div>
        <div>
          <p className="font-['Georgia',serif] text-[26px] italic tracking-wide text-white">
            yourbeep
          </p>
          <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-white/50">
            Understanding · Balance · Empathy
          </p>
        </div>
      </div>

      <div className="relative">
        <h1 className="text-[44px] font-bold leading-[1.15] text-white md:text-[52px]">
          Enter The <span style={{ color: "#4dd9ac" }}>Cognitive Sanctuary</span>
        </h1>
        <p className="mt-6 max-w-[400px] text-[15px] leading-[1.8] text-white/70">
          Designed for deep focus and scientific rigor. Where raw data
          transforms into clinical wisdom through intentional asymmetry and calm
          precision.
        </p>
      </div>
    </div>
  );
};

export default AuthBrandPanel;
