import { useEffect, useState } from "react";

const useClock = () => {
  const [time, setTime] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [day, setDay] = useState<string>("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      const hoursStr = hours.toString().padStart(2, "0");
      setTime(`${hoursStr}:${minutes} ${ampm}`);

      const dateOptions: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "2-digit",
      };
      setDate(new Intl.DateTimeFormat("en-US", dateOptions).format(now));

      const dayOptions: Intl.DateTimeFormatOptions = {
        weekday: "long",
      };
      setDay(new Intl.DateTimeFormat("en-US", dayOptions).format(now));
    };

    updateClock();
    const timerId = setInterval(updateClock, 60000);

    return () => clearInterval(timerId);
  }, []);

  return { time, date, day };
};

export default useClock;
