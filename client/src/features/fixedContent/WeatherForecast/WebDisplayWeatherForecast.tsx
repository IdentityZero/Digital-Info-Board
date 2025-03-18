import { useEffect, useState } from "react";
import {
  HourlyForecastType,
  WeatherForecastType,
} from "../../../types/FixedContentTypes";
import axios from "axios";
import { getNextFiveHours } from "../../../utils/utils";

const WebDisplayWeatherForecast = () => {
  const [weatherInfo, setWeatherInfo] = useState<
    WeatherForecastType | undefined
  >(undefined);
  const [hourlyInfo, setHourlyInfo] = useState<HourlyForecastType[]>([]);

  const key = import.meta.env.VITE_WEATHER_API_KEY;

  const url = `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=Laoag&days=5`;

  useEffect(() => {
    const fetchWeatherInfo = async () => {
      try {
        const res = await axios.get(url);
        const data: WeatherForecastType = res.data;

        setHourlyInfo(getNextFiveHours(data.forecast.forecastday[0].hour));
        setWeatherInfo(data);
      } catch (error) {}
    };
    fetchWeatherInfo();
  }, []);

  return (
    <div className="relative flex flex-col items-center h-full px-4 py-6 bg-white text-black">
      {/* Title */}
      <div className="text-3xl font-mono font-bold relative z-10">
        🌦️ Weather Forecast
      </div>

      {/* Divider */}
      <div className="w-5/6 h-0.5 bg-gray-300 my-3 relative z-10"></div>

      {/* 3-Day Forecast */}
      <div className="flex flex-col items-center space-y-4 relative z-10 w-full">
        {weatherInfo &&
          weatherInfo.forecast.forecastday.map((day, index) => {
            const date = new Date(day.date);

            const formattedDay: string = date.toLocaleDateString("en-US", {
              weekday: "short",
            });
            const formattedDate: string = date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });

            return (
              <div
                key={index}
                className="flex flex-row items-center justify-evenly w-[80%] p-2 bg-gray-100 rounded-lg border border-gray-300"
              >
                <span className="font-semibold text-sm ">
                  {formattedDay}, {formattedDate}
                </span>
                <img
                  src={day.day.condition.icon}
                  alt={day.day.condition.text}
                  className="h-8 w-8"
                />
                <span className="text-md">{day.day.avgtemp_c} &deg;C</span>
              </div>
            );
          })}
      </div>

      {/* Hourly Forecast */}
      <div className="relative z-10 flex w-full justify-around items-center mt-4">
        {hourlyInfo.map((hour, index) => {
          const datetime = new Date(hour.time);
          const time = datetime.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <div key={index} className="flex flex-col items-center text-sm">
              <span className="font-semibold">{time}</span>
              <img
                src={hour.condition.icon}
                alt={hour.condition.text}
                className="h-8 w-8"
              />
              <span className="opacity-90">{hour.temp_c} &deg;C</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default WebDisplayWeatherForecast;
