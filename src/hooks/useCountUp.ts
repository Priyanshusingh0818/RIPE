import { useState, useEffect, useRef } from "react";

export function useCountUp(target: number, duration = 2000, startOnMount = true) {
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);
  const rafRef = useRef<number>();

  const start = () => setStarted(true);

  useEffect(() => {
    if (startOnMount) setStarted(true);
  }, [startOnMount]);

  useEffect(() => {
    if (!started) return;

    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [started, target, duration]);

  return { value, start };
}
