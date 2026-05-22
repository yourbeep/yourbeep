type VideoCardProps = {
  label: string;
  image: string;
  accent: string;
};

const rowOne: VideoCardProps[] = [
  {
    label: "Activation & Settling Emotions",
    image: "/media/landing/video-marquee/activation-settling-emotions.png",
    accent: "#d6ece8",
  },
  {
    label: "Body Animations",
    image: "/media/landing/video-marquee/body-animations.png",
    accent: "#dce7f4",
  },
  {
    label: "Draw Your Breath",
    image: "/media/landing/video-marquee/draw-your-breath.png",
    accent: "#f0e3d2",
  },
  {
    label: "Emotional Cycle",
    image: "/media/landing/video-marquee/emotional-cycle.png",
    accent: "#eadfd7",
  },
  {
    label: "Energy Orientation",
    image: "/media/landing/video-marquee/energy-orientation.png",
    accent: "#d8ece2",
  },
  {
    label: "Episode 3.1",
    image: "/media/landing/video-marquee/episode-3-1-energetic-signal-orientation.png",
    accent: "#e3ebf2",
  },
  {
    label: "Episode 9.1",
    image: "/media/landing/video-marquee/episode-9-1-root-cause-summary.png",
    accent: "#efe4d7",
  },
];

const rowTwo: VideoCardProps[] = [
  {
    label: "Episode 10.1",
    image: "/media/landing/video-marquee/episode-10-1.png",
    accent: "#dee7e1",
  },
  {
    label: "Threat System",
    image: "/media/landing/video-marquee/episode-12-2-threat-system.png",
    accent: "#e6dde8",
  },
  {
    label: "Vagus Nerve",
    image: "/media/landing/video-marquee/episode-13-1-vagus-nerve.png",
    accent: "#dbe9ef",
  },
  {
    label: "TG Fit",
    image: "/media/landing/video-marquee/episode-29-1-tg-fit.png",
    accent: "#efe7d9",
  },
  {
    label: "Expansion & Integration",
    image: "/media/landing/video-marquee/expansion-integration-emotions.png",
    accent: "#d9eee7",
  },
  {
    label: "Reflection",
    image: "/media/landing/video-marquee/reflection.png",
    accent: "#efe2d5",
  },
  {
    label: "Transitions",
    image: "/media/landing/video-marquee/transitions.png",
    accent: "#dce8f0",
  },
  {
    label: "Show Name",
    image: "/media/landing/video-marquee/show-name.png",
    accent: "#e8e1d6",
  },
];

const VideoCard = ({ label, image, accent }: VideoCardProps) => (
  <div className="w-[260px] shrink-0 overflow-hidden rounded-[24px] border border-[#e7ece5] bg-white shadow-[0_8px_24px_rgba(15,40,48,0.08)] transition hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(15,40,48,0.12)]">
    <div className="relative h-[220px] overflow-hidden" style={{ backgroundColor: accent }}>
      <img
        src={image}
        alt={label}
        className="h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,24,28,0.72)] via-[rgba(10,24,28,0.12)] to-transparent" />
      <div className="absolute left-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-white/15 backdrop-blur-sm">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
          <polygon points="8,5 19,12 8,19" />
        </svg>
      </div>
      <div className="absolute inset-x-0 bottom-0 p-4">
        <p className="text-[13px] font-semibold text-white">{label}</p>
      </div>
    </div>
  </div>
);

const VideoMarqueeSection = () => {
  const repeatedRowOne = [...rowOne, ...rowOne, ...rowOne];
  const repeatedRowTwo = [...rowTwo, ...rowTwo, ...rowTwo];

  return (
    <section className="overflow-hidden bg-white py-16">
      <div className="mx-auto mb-10 max-w-[1320px] px-4 text-center md:px-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#4a8a90]">
          Guided Video Library
        </p>
        <h2 className="mt-3 text-4xl font-bold text-[#1a2e2e]">
          Interactive Experiences
        </h2>
        <p className="mx-auto mt-4 max-w-[560px] text-sm leading-7 text-[#5a6a6a]">
          25+ videos, 30+ guided activities, and a reflective progress layer
          designed to help learners move from insight into practice.
        </p>
      </div>

      <div className="mb-4 overflow-hidden">
        <div className="flex w-max gap-5 [animation:marquee-left_36s_linear_infinite]">
          {repeatedRowOne.map((video, index) => (
            <VideoCard key={`${video.label}-${index}`} {...video} />
          ))}
        </div>
      </div>

      <div className="overflow-hidden">
        <div className="flex w-max gap-5 [animation:marquee-right_38s_linear_infinite]">
          {repeatedRowTwo.map((video, index) => (
            <VideoCard key={`${video.label}-${index}`} {...video} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoMarqueeSection;
