interface Article {
  category: string;
  title: string;
  description: string;
}

const articles: Article[] = [
  {
    category: "Somatics",
    title: "Embodied Stillness in Motion",
    description:
      "Discovering the quiet spaces between movements. How somatic practices invite us to inhabit our physical form with profound presence.",
  },
  {
    category: "Wisdom",
    title: "The Clarity of Droplets",
    description:
      "Lessons drawn from observing the ephemeral nature of morning dew, translating natural phenomena into daily philosophies of letting go.",
  },
  {
    category: "Philosophy",
    title: "Designing for Absence",
    description:
      "An inquiry into minimalist thought not as deprivation, but as the intentional curation of space to allow the essential to emerge.",
  },
];

const RecentReflectionsSection = () => {
  return (
    <section className="bg-white px-4 pb-16 md:px-6">
      <div className="mx-auto max-w-[1320px]">
        {/* Row header */}
        <div className="mb-8 flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#1a2e2e]">
            Recent Reflections
          </h3>
          <a
            href="#"
            className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#4a8a90] transition hover:text-[#1a3a44]"
          >
            View All
          </a>
        </div>

        {/* Cards grid */}
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <article
              key={article.title}
              className="group flex cursor-pointer flex-col"
            >
              {/* Thumbnail — replace with <img> when ready */}
              <div className="mb-4 h-[180px] rounded-[20px] bg-[#eeeadc] transition group-hover:opacity-80" />

              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8a9a9a]">
                {article.category}
              </p>

              <h4 className="mt-1.5 text-[17px] font-bold leading-snug text-[#1a2e2e] transition group-hover:text-[#2a7888]">
                {article.title}
              </h4>

              <p className="mt-2 text-sm leading-[1.75] text-[#5a6a6a]">
                {article.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentReflectionsSection;
