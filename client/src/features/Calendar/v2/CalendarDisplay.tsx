import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  EventApi,
  EventClickArg,
  EventContentArg,
  EventSourceInput,
} from "@fullcalendar/core/index.js";

import LoadingMessage from "../../../components/LoadingMessage";
import CalendarCard from "./CalendarCard";

import { CalendarEventType } from "../../../types/FixedContentTypes";
import { listCalendarEventsApi } from "../../../api/calendarRequest";
import DisplayEvent from "./DisplayEvent";

type CalendarDisplayProps = {
  showGridControls?: boolean;
  showNavigation?: boolean;
  showEvents?: boolean;
  dayMaxEventRows?: number;
};

const CalendarDisplay = ({
  showGridControls = false,
  showNavigation = false,
  dayMaxEventRows = 0,
  showEvents = false,
}: CalendarDisplayProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetchingError, setHasFetchingError] = useState(false);
  const [events, setEvents] = useState<CalendarEventType[]>([]);

  const [targetEvent, setTargetEvent] = useState<EventApi | null>(null); // Will identify if update modal will show up

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

    showEvents && fetchCalendarEvents();
  }, []);

  const handleEventClick = (eventInfo: EventClickArg) => {
    const eventData = eventInfo.event;
    const targetEvent = eventInfo.view.calendar.getEventById(eventData.id);
    setTargetEvent(targetEvent);
  };

  return (
    <div className="w-full h-full bg-white">
      {isLoading ? (
        <LoadingMessage message="Fetching calendar events..." />
      ) : hasFetchingError ? (
        <div>Unexpected error occured. Please try again.</div>
      ) : (
        <>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: showNavigation ? "prev,next today" : "",
              center: "title",
              right: showGridControls
                ? "dayGridMonth,timeGridWeek,timeGridDay"
                : "",
            }}
            initialView="dayGridMonth"
            editable={false}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={dayMaxEventRows}
            weekends={true}
            height="100%"
            initialEvents={events as EventSourceInput}
            eventContent={renderEventContent}
            eventClick={handleEventClick}
          />
          {targetEvent && (
            <DisplayEvent
              isOpen={!!targetEvent}
              onCloseClick={() => setTargetEvent(null)}
              initialData={targetEvent}
            />
          )}
        </>
      )}
    </div>
  );
};
export default CalendarDisplay;

function renderEventContent(eventContent: EventContentArg) {
  return (
    <CalendarCard
      title={eventContent.event.title}
      time={eventContent.timeText}
      location={eventContent.event.extendedProps.location}
      description={eventContent.event.extendedProps.description}
    />
  );
}
