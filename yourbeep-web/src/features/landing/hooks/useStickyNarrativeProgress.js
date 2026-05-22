import { useEffect, useState } from "react";

export const useStickyNarrativeProgress = (containerRef, stepCount) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return undefined;

    const handleScroll = () => {
      const rect = node.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const totalScrollable = Math.max(rect.height - viewportHeight, 1);
      const scrolled = Math.min(Math.max(-rect.top, 0), totalScrollable);
      const nextProgress = scrolled / totalScrollable;
      setProgress(nextProgress);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [containerRef]);

  const stepProgress = progress * stepCount;
  const activeStep = Math.min(stepCount - 1, Math.floor(stepProgress));
  const localProgress = Math.min(1, Math.max(0, stepProgress - activeStep));

  return {
    activeStep,
    localProgress,
    overallProgress: progress,
  };
};

