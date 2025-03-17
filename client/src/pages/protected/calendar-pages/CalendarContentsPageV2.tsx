import { useEffect, useState } from "react";

import FullCalendarFeature from "../../../features/Calendar/v2/FullCalendarFeature";
import { listCalendarEventsApi } from "../../../api/calendarRequest";
import { CalendarEventType } from "../../../types/FixedContentTypes";
import LoadingMessage from "../../../components/LoadingMessage";

const CalendarContentsPageV2 = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasFetchingError, setHasFetchingError] = useState(false);
  const [events, setEvents] = useState<CalendarEventType[]>([]);

  useEffect(() => {
    const fetchCalendarEvents = async () => {
      try {
        setIsLoading(true);
        setHasFetchingError(false);
        const res_data = await listCalendarEventsApi();
        setEvents(res_data);
      } catch (error) {
        setHasFetchingError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCalendarEvents();
  }, []);

  return (
    <div className="w-full h-full">
      {isLoading ? (
        <LoadingMessage message="Fetching calendar events..." />
      ) : hasFetchingError ? (
        <div>Unexpected error occured. Please try again.</div>
      ) : (
        <FullCalendarFeature initialEventsList={events} />
      )}
    </div>
  );
};
export default CalendarContentsPageV2;
