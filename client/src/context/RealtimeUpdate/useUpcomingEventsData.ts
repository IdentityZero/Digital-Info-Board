import { useEffect, useState } from "react";
import { UpcomingEventType } from "../../types/FixedContentTypes";
import { listUpcomingEventsApi } from "../../api/fixedContentRquests";

const useUpcomingEventsData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<UpcomingEventType[]>([]);
  console.log(events);

  const fetchEvents = () => {
    let delay = 1000;

    const retryFetch = async () => {
      try {
        setIsLoading(true);
        const res_data = await listUpcomingEventsApi();
        setEvents(res_data);
      } catch (error) {
        delay = Math.min(delay * 2, 30000);
        setTimeout(retryFetch, delay);
      } finally {
        setIsLoading(false);
      }
    };
    retryFetch();
  };

  const insertItem = (data: UpcomingEventType) => {
    setEvents((prev) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const eventDate = new Date(data.date);
      eventDate.setHours(0, 0, 0, 0);

      if (eventDate < today) {
        return prev;
      }

      const copy = [...prev, data].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      return copy.slice(0, 3);
    });
  };

  const updateItem = (id: number, updatedData: UpcomingEventType) => {
    setEvents((prev) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const eventDate = new Date(updatedData.date);
      eventDate.setHours(0, 0, 0, 0);

      if (eventDate < today) {
        return prev.filter((item) => item.id !== id);
      }

      const index = prev.findIndex((item) => item.id === id);

      if (index === -1) {
        return [...prev, updatedData]
          .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          )
          .slice(0, 3);
      }

      return prev.map((item) => (item.id === id ? updatedData : item));
    });
  };

  const deleteItem = (id: number) => {
    setEvents((prev) => prev.filter((item) => item.id !== id));
  };

  useEffect(() => {
    fetchEvents();
  }, []);
  return { events, insertItem, updateItem, deleteItem, isLoading };
};
export default useUpcomingEventsData;
