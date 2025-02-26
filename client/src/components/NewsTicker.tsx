import React, { useEffect, useRef } from "react";

interface NewsTickerProps {
  headlines: string[];
  speed?: number;
}

const NewsTicker: React.FC<NewsTickerProps> = ({ headlines, speed = 10 }) => {
  const tickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ticker = tickerRef.current;
    if (!ticker) return;

    let animationFrameId: number;
    let start: number;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = ((timestamp - start) / 1000) * 50;
      ticker.style.transform = `translateX(-${progress}px)`;
      if (progress >= ticker.scrollWidth / 2) {
        start = timestamp;
        ticker.style.transform = "translateX(0)";
      }
      animationFrameId = requestAnimationFrame(step);
    };
    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [headlines, speed]);

  return (
    <div className="w-full bg-gray-200 p-2 text-gray-700 overflow-hidden relative shadow-lg shadow-gray-500/50">
      <div className="flex whitespace-nowrap" ref={tickerRef}>
        {headlines.concat(headlines).map((headline, index) => (
          <span key={index} className="mx-8 text-lg font-semibold">
            {headline}
          </span>
        ))}
      </div>
    </div>
  );
};

export default NewsTicker;
