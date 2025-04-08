import { useEffect, useState } from "react";

import LoadingMessage from "../../../components/LoadingMessage";
import ErrorMessage from "../../../components/ErrorMessage";

import { listCalendarEventsApi } from "../../../api/calendarRequest";
import { CalendarEventType } from "../../../types/FixedContentTypes";
import FullCalendarFeature from "../../../features/Calendar/v2/FullCalendarFeature";

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
        <ErrorMessage message="Something went wrong while fetching Calendar Events. Please try again." />
      ) : (
        <FullCalendarFeature initialEventsList={events} />
      )}
    </div>
  );
};
export default CalendarContentsPageV2;
