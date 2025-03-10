import { useEffect, useState } from "react";
import useClock from "../../fixedContent/hooks/useClock";

const DateTimeCard = () => {
  const { time, date, day } = useClock();
  const [quoteIndex, setQuoteIndex] = useState(0);

  const quotes = [
    "Believe in yourself.",
    "Every day is a chance to learn.",
    "Mistakes help us grow.",
    "Be kind. Work hard.",
    "You are capable of great things!",
  ];

  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 5000);

    return () => {
      clearInterval(quoteInterval);
    };
  }, []);
  return (
    <>
      {/* Glowing Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/40 to-purple-500/30 rounded-2xl blur-2xl"></div>

      {/* Content 1 */}
      <div className="text-7xl font-mono font-bold mt-3 animate-pulse">
        {time}
      </div>

      {/* Divider */}
      <div className="w-5/6 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse"></div>

      {/* Content 2 */}
      <div className="flex flex-col items-center">
        <div className="text-6xl font-bold tracking-wide">{day}</div>
        <div className="text-4xl opacity-90">{date}</div>
      </div>

      {/* Rotating Quote */}
      <div className="text-lg italic opacity-75 mt-2 transition-opacity duration-500">
        "{quotes[quoteIndex]}"
      </div>
    </>
  );
};
export default DateTimeCard;
