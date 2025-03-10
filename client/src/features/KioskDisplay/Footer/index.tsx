import { memo } from "react";
import TextNewsTicker from "../TextNewsTicker";
import DateTimeCard from "./DateTimeCard";
import WeatherForecast from "./WeatherForecast";

const Footer = memo(({ headlines }: { headlines: string[] }) => {
  return (
    <div className="w-full h-full">
      <TextNewsTicker headlines={headlines} />
      <div className="w-full flex flex-row gap-1 p-2 text-white text-md">
        {/* Weather Forecast */}
        <div
          className="relative flex-1 flex flex-col items-center justify-between 
                 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl p-6 
                 text-white text-center h-[450px] w-[360px] max-h-[450px] overflow-hidden"
        >
          <WeatherForecast />
        </div>

        {/* Date Time Card */}
        <div
          className="relative flex-1 flex flex-col items-center justify-between 
                   bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl p-6 
                   text-white text-center h-[450px] w-[360px] max-h-[450px] overflow-hidden"
        >
          <DateTimeCard />
        </div>

        {/* Facts */}
        <div className="flex-1 flex items-center justify-center  h-[450px] max-h-[450px] bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl overflow-hidden">
          <img
            src="https://picsum.photos/200/300?random=2"
            className="h-full w-full object-fill"
            alt="Image"
          />
        </div>
      </div>

      <div className="w-full flex items-center justify-center text-white text-sm p-0.5 mb-1 lowercase">
        Powered by Computer Engineering Students
      </div>
    </div>
  );
});

export default Footer;
