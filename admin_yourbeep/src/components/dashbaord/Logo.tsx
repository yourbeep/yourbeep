type LogoProps = {
  compact?: boolean;
  studio?: boolean;
};

export default function Logo({ compact = false, studio = false }: LogoProps) {
  return (
    <div className="brand-lockup">
      <div
        className="brand-mark h-10 w-10 overflow-hidden rounded-lg bg-white"
        aria-hidden="true"
      >
        <img
          src="/app_logo.png"
          alt="YourBeep"
          className="h-full w-full object-contain"
        />
      </div>
      {!compact && (
        <div>
          <div className="brand-name">
            {studio ? "Studio Alpha" : "YourBeep"}
          </div>
          <div className="brand-subtitle">
            {studio ? "Productivity Suite" : "Admin Workspace"}
          </div>
        </div>
      )}
    </div>
  );
}
