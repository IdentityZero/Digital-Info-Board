import { memo } from "react";
import TextNewsTicker from "../TextNewsTicker";
// import DateTimeCard from "./DateTimeCard";
import WeatherForecast from "./WeatherForecast";
import UpcomingEventsCard from "./UpcomingEventsCard";
import MediaDisplay from "../MediaDisplay";
import { SettingsType } from "../../../types/SettingTypes";
import { convertDurationToSeconds } from "../../../utils/utils";

type FooterProps = {
  headlines: string[];
  settings: SettingsType;
};

const Footer = memo(({ headlines, settings }: FooterProps) => {
  const {
    show_weather_forecast,
    show_upcoming_events,
    show_media_displays,
    media_displays_slide_duration,
  } = settings;

  const headlinesEmptyContiner = [
    "Education is the most powerful weapon which you can use to change the world. – Nelson Mandela",
    "The beautiful thing about learning is that no one can take it away from you. – B.B. King",
    "Success is the sum of small efforts, repeated day in and day out. – Robert Collier",
    "Your attitude, not your aptitude, will determine your altitude. – Zig Ziglar",
    "Do not wait to strike till the iron is hot, but make it hot by striking. – William Butler Yeats",
  ];

  // Check if any of the following contents are showing
  return (
    <div className="w-full h-full">
      <div className="w-full flex flex-row gap-1 p-2 text-white text-md">
        {/* Weather Forecast */}
        {show_weather_forecast && (
          <div
            className="relative flex-1 flex flex-col items-center justify-between 
         bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl 
         text-white text-center h-[350px] max-h-[350px] overflow-hidden"
          >
            <WeatherForecast />
          </div>
        )}

        {/* Date Time or Upcoming Events Card */}
        {show_upcoming_events && (
          <div
            className="relative flex-1 flex flex-col items-center justify-between 
          bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl 
          text-white text-center h-[350px] max-h-[350px] overflow-hidden"
          >
            {/* <DateTimeCard /> */}
            <UpcomingEventsCard />
          </div>
        )}

        {/* Facts */}
        {show_media_displays && (
          <div className="flex-1 flex items-center justify-center  h-[350px] max-h-[350px] bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl overflow-hidden">
            <MediaDisplay
              slideDuration={
                convertDurationToSeconds(media_displays_slide_duration) * 1000
              }
            />
          </div>
        )}
      </div>
      <TextNewsTicker
        headlines={headlines.length > 0 ? headlines : headlinesEmptyContiner}
      />

      <div className="w-full flex items-center justify-center text-white text-sm p-0.5 mb-1 lowercase">
        Powered by Computer Engineering Students
      </div>
    </div>
  );
});

export default Footer;
