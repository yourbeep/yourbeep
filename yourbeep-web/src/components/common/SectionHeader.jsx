const SectionHeader = ({ eyebrow, title, description, align = "left" }) => {
  const textAlign = align === "center" ? "text-center mx-auto" : "";

  return (
    <div className={`max-w-2xl ${textAlign}`}>
      {eyebrow ? (
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-3 text-3xl font-bold leading-tight text-[var(--text)] md:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-sm leading-7 text-[var(--muted)] md:text-[15px]">
          {description}
        </p>
      ) : null}
    </div>
  );
};

export default SectionHeader;
