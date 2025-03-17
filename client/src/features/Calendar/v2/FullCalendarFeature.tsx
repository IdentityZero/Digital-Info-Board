import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  CalendarApi,
  DateSelectArg,
  EventApi,
  EventClickArg,
  EventContentArg,
  EventSourceInput,
} from "@fullcalendar/core/index.js";

import CreateEvent from "./CreateEvent";
import { CalendarEventType } from "../../../types/FixedContentTypes";
import CalendarCard from "./CalendarCard";
import UpdateEvent from "./UpdateEvent";

type FullCalendarFeatureProps = {
  initialEventsList: CalendarEventType[];
};

const FullCalendarFeature = ({
  initialEventsList,
}: FullCalendarFeatureProps) => {
  const [events, setEvents] = useState<EventApi[]>([]);

  const handleEvents = (events: EventApi[]) => {
    setEvents(events);
  };

  // #region Topic: Create events
  const [calendarView, setCalendarView] = useState<CalendarApi | null>(null);
  const [selectedDates, setSelectedDates] = useState<{
    start: Date;
    end: Date;
  } | null>(null); // This will determine if create modal will pop up

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    setSelectedDates({ start: selectInfo.start, end: selectInfo.end });
    setCalendarView(selectInfo.view.calendar);
  };

  const handleOnCreateSuccess = (newData: CalendarEventType) => {
    calendarView?.unselect();
    calendarView?.addEvent({
      id: String(newData.id),
      title: newData.title,
      start: newData.start,
      end: newData.end,
      extendedProps: {
        description: newData.description,
        location: newData.location,
      },
    });
    setSelectedDates(null);
    setCalendarView(null);
  };
  // #endregion

  // #region Topic: Update and Delete functions
  const [targetEvent, setTargetEvent] = useState<EventApi | null>(null); // Will identify if update modal will show up

  const handleEventClick = (eventInfo: EventClickArg) => {
    const eventData = eventInfo.event;
    const targetEvent = eventInfo.view.calendar.getEventById(eventData.id);
    setTargetEvent(targetEvent);
  };

  const handleDeleteSuccess = () => {
    targetEvent?.remove();
    setTargetEvent(null);
  };

  const handleUpdateSuccess = (updatedData: CalendarEventType) => {
    const eventToUpdate = events.find(
      (event) => event.id === String(updatedData.id)
    );

    if (!eventToUpdate) return;

    eventToUpdate.setProp("title", updatedData.title);
    eventToUpdate.setExtendedProp("description", updatedData.description);
    eventToUpdate.setExtendedProp("location", updatedData.location);
    eventToUpdate.setStart(updatedData.start);
    eventToUpdate.setEnd(updatedData.end);
    setTargetEvent(null);
  };

  // #endregion

  return (
    <div className="w-full h-full">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        initialView="timeGridWeek"
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        contentHeight={500}
        initialEvents={initialEventsList as EventSourceInput}
        select={handleDateSelect}
        eventContent={renderEventContent}
        eventClick={handleEventClick}
        eventsSet={handleEvents}
      />
      <CreateEvent
        isOpen={!!selectedDates} // Open if we have selected a date
        onCloseClick={() => setSelectedDates(null)}
        initialStartDate={selectedDates?.start}
        initialEndDate={selectedDates?.end}
        onSuccess={handleOnCreateSuccess}
      />
      {targetEvent && (
        <UpdateEvent
          isOpen={!!targetEvent}
          onCloseClick={() => setTargetEvent(null)}
          initialData={targetEvent}
          onDeleteSuccess={handleDeleteSuccess}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
};
export default FullCalendarFeature;

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
