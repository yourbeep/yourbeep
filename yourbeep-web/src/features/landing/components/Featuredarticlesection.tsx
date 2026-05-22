import articleImage from "../../../assets/feature_article_th.png";

const FeaturedArticleSection = () => {
  return (
    <section className="bg-white px-4 pt-4 pb-10 md:px-6">
      <div className="mx-auto max-w-[1320px]">
        {/* Header bar */}
        <div className="mb-6 rounded-[18px] bg-gradient-to-r from-[#1a3a44] via-[#2a6878] to-[#3a9898] px-6 py-4">
          <span className="text-lg font-bold tracking-tight text-white md:text-[20px]">
            Articles
          </span>
        </div>

        {/* Featured card */}
        <div className="overflow-hidden rounded-[28px] bg-[#f8f8ee] shadow-sm lg:flex">
          {/* Image side */}
          <div className="flex min-h-[280px] items-center justify-center bg-[#f4f4e8] lg:w-[45%]">
            <img
              src={articleImage}
              alt="The Architecture of Silence"
              className="h-[240px] w-[200px] object-contain"
            />
          </div>

          {/* Content side */}
          <div className="flex flex-1 flex-col justify-center px-5 py-6 sm:px-8 sm:py-8">
            <span className="inline-flex w-fit items-center rounded-full bg-[#fde8d8] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#c46a3a]">
              Feature
            </span>

            <h3 className="mt-4 text-2xl font-bold leading-tight text-[#1a2e2e] sm:text-[28px] md:text-[32px]">
              The Architecture of Silence
            </h3>

            <p className="mt-3 text-sm leading-7 text-[#5a6a6a]">
              In an era defined by constant noise, the conscious design of empty
              space becomes our most vital sanctuary. Exploring how physical
              environments shape our internal stillness.
            </p>

            <div className="mt-4 flex items-center gap-3 text-[11px] text-[#8a9a9a]">
              <span>READ ESSAY</span>
              <span>•</span>
              <span>12 MIN READ</span>
            </div>

            <a
              href="#"
              className="mt-5 inline-flex w-fit items-center rounded-full bg-[#1a3a40] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2a5460]"
            >
              Sign up for Newsletter
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedArticleSection;
