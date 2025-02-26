import useClock from "../fixedContent/hooks/useClock";
import { useEffect, useState } from "react";
import axios from "axios";
import LoadingMessage from "../../components/LoadingMessage";

type ForecastDayType = {
  date: string;
  day: {
    avghumidity: number;
    avgtemp_c: number;
    avgtemp_f: number;
    maxwind_kph: number;
    condition: {
      icon: string;
      text: string;
    };
  };
};

type WeatherForecastType = {
  forecast: { forecastday: ForecastDayType[] };
};

const KMWeatherForecast = () => {
  const { time, date } = useClock();
  const [weatherInfo, setWeatherInfo] = useState<
    WeatherForecastType | undefined
  >(undefined);
  const [fetchWeatherInfoError, setFetchWeatherInfoError] = useState(false);

  // PUT KEY HERE
  const key = import.meta.env.VITE_WEATHER_API_KEY;

  const url = `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=Laoag&days=3`;

  useEffect(() => {
    const fetchWeatherInfo = async () => {
      try {
        const res_data = await axios.get(url);
        setWeatherInfo(res_data.data);
      } catch (error) {
        setFetchWeatherInfoError(true);
      }
    };
    fetchWeatherInfo();
  }, []);

  return (
    <div className="flex flex-col items-center gap-2.5 h-full">
      <div className="w-full">
        <p className="text-6xl font-thin min-w-[200px] text-center font-mono tabular-nums">
          {time}
        </p>
        <p className="text-3xl min-w-[200px] text-center font-mono tabular-nums">
          {date}
        </p>
      </div>
      <div className="w-full flex flex-col items-center gap-4">
        {weatherInfo && weatherInfo.forecast.forecastday.length > 0 ? (
          weatherInfo.forecast.forecastday.map((info, index) => (
            <ForecastCard forecastInfo={info} key={index} />
          ))
        ) : fetchWeatherInfoError ? (
          <div>Error loading forecasts</div>
        ) : (
          <LoadingMessage message="Loading forecast..." />
        )}
      </div>
    </div>
  );
};
export default KMWeatherForecast;

function ForecastCard({ forecastInfo }: { forecastInfo: ForecastDayType }) {
  const getDayOfWeek = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { weekday: "short" };
    const day = date.toLocaleDateString("en-US", options);

    const dayMap: { [key: string]: string } = {
      Sun: "Su",
      Mon: "M",
      Tue: "T",
      Wed: "W",
      Thu: "Th",
      Fri: "F",
      Sat: "Sa",
    };

    return dayMap[day] || day;
  };

  const isToday = (dateString: string): boolean => {
    const inputDate = new Date(dateString);
    const today = new Date();
    return (
      inputDate.toISOString().split("T")[0] ===
      today.toISOString().split("T")[0]
    );
  };

  return (
    <div
      className={`w-[300px] flex bg-white h-16 rounded-md shadow-md ${
        isToday(forecastInfo.date) && "shadow-cyanBlue mb-2.5"
      } border overflow-hidden`}
    >
      <div className="basis-1/2 flex">
        <div className="basis-1/2 bg-[#295989] text-center text-6xl text-white">
          {getDayOfWeek(forecastInfo.date)}
        </div>
        <div className="basis-1/2 w-full flex flex-col justify-center">
          <img
            src={forecastInfo.day.condition.icon}
            alt={forecastInfo.day.condition.text}
          />
        </div>
      </div>
      <div className="basis-1/2 text-xs flex flex-col justify-center">
        <div className="flex items-center">
          <p className="min-w-10">Wnd:</p>
          <p className="font-bold">{forecastInfo.day.maxwind_kph} KMPH</p>
        </div>
        <div className="flex items-center">
          <p className="min-w-10">Hum:</p>
          <p className="font-bold">{forecastInfo.day.avghumidity}%</p>
        </div>
        <div className="flex items-center">
          <p className="min-w-10">Temp:</p>
          <p className="font-bold">
            {forecastInfo.day.avgtemp_c} &deg;C / {forecastInfo.day.avgtemp_f}{" "}
            &deg;F
          </p>
        </div>
      </div>
    </div>
  );
}
