import { useEffect, useState } from "react";
import axios from "axios";
import LoadingMessage from "../../../components/LoadingMessage";
import { getNextFiveHours } from "../../../utils/utils";
import {
  HourlyForecastType,
  WeatherForecastType,
} from "../../../types/FixedContentTypes";

const WeatherForecast = () => {
  const [weatherInfo, setWeatherInfo] = useState<
    WeatherForecastType | undefined
  >(undefined);
  const [hourlyInfo, setHourlyInfo] = useState<HourlyForecastType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const key = import.meta.env.VITE_WEATHER_API_KEY;

  const url = `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=Laoag&days=5`;

  const fetchWeatherInfo = () => {
    let delay = 1000;

    const retryFetch = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(url);
        const data: WeatherForecastType = res.data;

        setHourlyInfo(getNextFiveHours(data.forecast.forecastday[0].hour));
        setWeatherInfo(data);
      } catch (error) {
        delay = Math.min(delay * 2, 30000);
        setTimeout(retryFetch, delay);
      } finally {
        setIsLoading(false);
      }
    };
    retryFetch();
  };

  useEffect(() => {
    fetchWeatherInfo();
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-between rounded-2xl shadow-lg h-full w-full px-1">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/40 to-purple-500/30 rounded-2xl blur-2xl"></div>
      <div className="relative z-10 text-3xl font-semibold">
        Weather Forecast
      </div>

      {isLoading && <LoadingMessage message="Loading..." />}

      {/* 3 Day forecast */}
      <div className="relative z-10 flex flex-col w-full items-center gap-4">
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

            // Card
            return (
              <div
                key={index}
                className="flex flex-col items-center justify-center w-full py-1 bg-white/10 rounded-lg border border-white/20 "
              >
                <div className="flex justify-between w-full px-1">
                  <span className="font-semibold text-sm w-1/3">
                    {formattedDay}, {formattedDate}
                  </span>
                  <img
                    src={day.day.condition.icon}
                    alt={day.day.condition.text}
                    className="h-8 w-8"
                  />
                  <span className="text-md w-1/3">
                    {day.day.avgtemp_c} &deg;C
                  </span>
                </div>
              </div>
            );
          })}
      </div>

      {/* Hourly */}
      <div className="relative z-10 flex w-full justify-around items-center mb-4">
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
export default WeatherForecast;
