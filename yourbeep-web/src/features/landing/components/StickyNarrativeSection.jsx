import { useMemo, useRef } from "react";
import { useStickyNarrativeProgress } from "../hooks/useStickyNarrativeProgress";
import stickyImage from "../../../assets/sticky_img.png";

const steps = [
  {
    number: "1",
    lines: [
      "Drowning in all kinds of beeps –",
      "notifications, emails, messages, to-dos?",
      "But seem to have muted your own inner beep?",
    ],
  },
  {
    number: "2",
    lines: [
      "You know something feels stuck.",
      "What if it's just a pattern you haven't decoded yet?",
    ],
  },
  {
    number: "3",
    lines: [
      "You don't need to overhaul your life.",
      "You just need to understand it better",
      "with the right tools and terminology.",
    ],
  },
  {
    number: "4",
    lines: [
      "Somewhere between who you are",
      "and who you could be —",
      "that's where Yourbeep lives.",
    ],
  },
];

const getStepStyle = (currentStep, activeStep, localProgress) => {
  const distance = currentStep - activeStep;

  if (distance === 0) {
    const lift = 20 * (1 - localProgress);
    // Three-phase blur: start blurry -> become clear -> stay clear -> become blurry
    let blur;
    if (localProgress < 0.3) {
      // Phase 1: Blur to clear (0-30%)
      blur = 14 * (1 - localProgress / 0.3);
    } else if (localProgress < 0.7) {
      // Phase 2: Stay clear (30-70%)
      blur = 0;
    } else {
      // Phase 3: Clear to blur (70-100%)
      blur = 14 * ((localProgress - 0.7) / 0.3);
    }
    const opacity = 0.2 + 0.8 * localProgress;

    return {
      opacity,
      transform: `translateY(-${lift}px)`,
      filter: `blur(${blur}px)`,
    };
  }

  if (distance < 0) {
    return {
      opacity: 0,
      transform: "translateY(-32px)",
      filter: "blur(16px)",
    };
  }

  return {
    opacity: 0,
    transform: "translateY(24px)",
    filter: "blur(16px)",
  };
};

const StickyNarrativeSection = () => {
  const containerRef = useRef(null);
  const { activeStep, localProgress, overallProgress } =
    useStickyNarrativeProgress(containerRef, steps.length);

  const backgroundTransform = useMemo(() => {
    const translateY = overallProgress * 8;
    const scale = 1.12 + overallProgress * 0.09;
    return `translate3d(0, ${translateY}%, 0) scale(${scale})`;
  }, [overallProgress]);

  return (
    <section
      id="journey"
      ref={containerRef}
      className="relative bg-[#080808]"
      style={{ height: `${steps.length * 100}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[#0d0909]" />
          <img
            src={stickyImage}
            alt="Abstract background"
            className="absolute inset-0 h-full w-full object-cover opacity-80"
            style={{
              transform: backgroundTransform,
              transformOrigin: "center",
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.08),rgba(0,0,0,0.72))]" />
        </div>

        <div className="relative z-10 flex h-full flex-col">
          <div className="flex items-center justify-between px-6 pt-6 md:px-10">
            <div className="grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-white/8 text-sm font-semibold text-white backdrop-blur-sm md:h-14 md:w-14 md:text-base">
              {steps[activeStep].number}
            </div>

            <div className="hidden items-center gap-3 md:flex">
              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className="h-1.5 w-16 overflow-hidden rounded-full bg-white/10"
                >
                  <div
                    className="h-full rounded-full bg-white transition-all duration-500"
                    style={{
                      width:
                        index < activeStep
                          ? "100%"
                          : index === activeStep
                            ? `${Math.max(localProgress * 100, 8)}%`
                            : "0%",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex flex-1 items-center justify-center px-6 md:px-10">
            {steps.map((step, index) => {
              const style = getStepStyle(index, activeStep, localProgress);
              const isActive = index === activeStep;

              return (
                <div
                  key={step.number}
                  className="absolute left-1/2 top-1/2 w-full max-w-6xl -translate-x-1/2 -translate-y-1/2 px-4 text-center transition-[opacity,transform,filter] duration-500"
                  style={style}
                >
                  <div className="mx-auto max-w-5xl">
                    {step.lines.map((line) => (
                      <div
                        key={line}
                        className="text-3xl font-semibold leading-tight tracking-[-0.03em] text-white md:text-5xl lg:text-6xl"
                      >
                        {line}
                      </div>
                    ))}
                  </div>

                  {step.tags ? (
                    <div className="mx-auto mt-12 flex max-w-3xl flex-wrap justify-center gap-3">
                      {step.tags.map((tag, tagIndex) => (
                        <div
                          key={tag}
                          className="inline-flex items-center gap-3 rounded-full border border-white/16 bg-white/8 px-4 py-2 text-sm font-medium text-white/92 backdrop-blur-sm transition-all duration-500"
                          style={{
                            opacity: isActive
                              ? Math.min(1, 0.55 + localProgress * 0.7)
                              : 0,
                            transform: isActive
                              ? `translateY(${Math.max(0, 12 - localProgress * 12)}px)`
                              : "translateY(18px)",
                            transitionDelay: `${tagIndex * 60}ms`,
                          }}
                        >
                          <span>{tag}</span>
                          <span className="h-1.5 w-1.5 rounded-full bg-white/65" />
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>

          <div className="px-6 pb-8 md:hidden">
            <div className="flex items-center gap-2">
              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className="h-1.5 flex-1 rounded-full bg-white/10"
                >
                  <div
                    className="h-full rounded-full bg-white transition-all duration-500"
                    style={{
                      width:
                        index < activeStep
                          ? "100%"
                          : index === activeStep
                            ? `${Math.max(localProgress * 100, 8)}%`
                            : "0%",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StickyNarrativeSection;
