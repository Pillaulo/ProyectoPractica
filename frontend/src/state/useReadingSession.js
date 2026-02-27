import { useEffect, useMemo, useState } from "react";

export const useReadingSession = (story) => {
  const [mode, setMode] = useState("frases");
  const [index, setIndex] = useState(0);

  const steps = useMemo(() => {
    if (!story) {
      return [];
    }
    return mode === "frases" ? story.frases : story.parrafos;
  }, [story, mode]);

  useEffect(() => {
    setIndex(0);
  }, [story, mode]);

  const goPrev = () => setIndex((current) => Math.max(0, current - 1));
  const goNext = () =>
    setIndex((current) => Math.min(steps.length - 1, current + 1));
  const reset = () => setIndex(0);

  return {
    mode,
    setMode,
    index,
    steps,
    currentStep: steps[index] || "",
    total: steps.length,
    goPrev,
    goNext,
    reset,
  };
};
