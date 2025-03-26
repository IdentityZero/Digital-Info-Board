import { useEffect, useState } from "react";
import { UpcomingEventType } from "../../types/FixedContentTypes";
import { listUpcomingEventsApi } from "../../api/fixedContentRquests";

const useUpcomingEventsData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<UpcomingEventType[]>([]);

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
      const copy = [...prev, data];

      copy.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      if (copy.length > 3) {
        copy.pop();
      }
      return [...copy];
    });
  };

  const deleteItem = (id: number) => {
    setEvents((prev) => prev.filter((item) => item.id !== id));
  };

  useEffect(() => {
    fetchEvents();
  }, []);
  return { events, insertItem, deleteItem, isLoading };
};
export default useUpcomingEventsData;
