import { useEffect, useState } from "react";

import { formatInputDate } from "../../../utils/formatters";

import { UpcomingEventType } from "../../../types/FixedContentTypes";
import { listUpcomingEventsApi } from "../../../api/fixedContentRquests";
import LoadingMessage from "../../../components/LoadingMessage";

const WebDisplayEvents = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Reload if error

  const [events, setEvents] = useState<UpcomingEventType[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const res_data = await listUpcomingEventsApi();
        setEvents(res_data);
      } catch (error) {
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="relative flex flex-col items-center h-full px-2 py-3 sm:px-3 sm:py-4 md:px-4 md:py-6 bg-white text-black">
      {/* Title */}
      <div className="text-xl sm:text-2xl md:text-3xl font-mono font-bold relative z-10">
        📅 Upcoming Events
      </div>

      {/* Divider */}
      <div className="w-5/6 h-0.5 bg-gray-300 my-3 relative z-10"></div>

      {/* Events List */}
      {isLoading ? (
        <LoadingMessage message="Loading..." />
      ) : hasError ? (
        <div>Unexpected error occured</div>
      ) : (
        <div className="flex flex-col items-center space-y-4 relative z-10">
          {events.map((event, index) => (
            <div
              key={index}
              className="text-center text-sm md:text-base lg:text-lg"
            >
              <div className="font-bold tracking-wide text-black">
                {event.name}
              </div>
              <div className="opacity-90 text-gray-600">
                {formatInputDate(event.date)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default WebDisplayEvents;
