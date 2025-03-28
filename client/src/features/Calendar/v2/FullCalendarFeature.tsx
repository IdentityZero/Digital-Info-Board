import { useEffect, useState } from "react";
import { FaExclamationCircle } from "react-icons/fa";
import { useLocation } from "react-router-dom";
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

import ClosableMessage from "../../../components/ClosableMessage";
import CalendarCard from "./CalendarCard";

import { CalendarEventType } from "../../../types/FixedContentTypes";

import UpdateEvent from "./UpdateEvent";
import CreateEvent from "./CreateEvent";

type FullCalendarFeatureProps = {
  initialEventsList: CalendarEventType[];
};

const FullCalendarFeature = ({
  initialEventsList,
}: FullCalendarFeatureProps) => {
  const { hash } = useLocation();
  const targetId = hash.substring(1);
  const idExists = initialEventsList.some(
    (item) => String(item.id) === targetId
  );

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
    const eventTarget = eventInfo.view.calendar.getEventById(eventData.id);
    setTargetEvent(eventTarget);
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

  function renderEventContent(eventContent: EventContentArg) {
    return (
      <CalendarCard
        title={eventContent.event.title}
        time={eventContent.timeText}
        location={eventContent.event.extendedProps.location}
        description={eventContent.event.extendedProps.description}
        isHighlighted={eventContent.event.id === targetId}
      />
    );
  }

  useEffect(() => {
    if (!targetId || initialEventsList.length === 0) return;

    const target = events.find((event) => event.id === targetId);
    if (target) {
      setTargetEvent(target);
    }
  }, [initialEventsList]);
  // #endregion

  return (
    <div className="w-full h-full">
      {!idExists && targetId !== "" && (
        <div className="mb-2">
          <ClosableMessage
            className="w-full flex flex-row items-center justify-between gap-4 bg-red-100 border border-red-400 rounded-lg shadow-md p-4"
            icon={FaExclamationCircle}
          >
            It looks like the data you are looking for does not exist here. Try
            looking at another page.
          </ClosableMessage>
        </div>
      )}
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        initialView="dayGridMonth"
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={5}
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
