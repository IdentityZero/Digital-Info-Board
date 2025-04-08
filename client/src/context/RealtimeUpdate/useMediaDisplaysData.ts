import { useEffect, useState } from "react";

import { MediaDisplayType } from "../../types/FixedContentTypes";
import { listMediaDisplaysApi } from "../../api/fixedContentRquests";
import { sortItemsByPosition } from "../../utils/utils";

const useMediaDisplaysData = () => {
  const [mediaDisplays, setMediaDisplays] = useState<MediaDisplayType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);

  const fetchMediaDisplays = () => {
    let delay = 1000;

    const retryFetch = async () => {
      try {
        setIsLoading(true);
        const res_data = await listMediaDisplaysApi();
        setMediaDisplays(res_data);
        // setIsTransitioning(false);
        setIsReady(true);
      } catch (error) {
        delay = Math.min(delay * 2, 30000);
        setTimeout(retryFetch, delay);
      } finally {
        setIsLoading(false);
      }
    };

    retryFetch();
  };

  const updateSequence = (data: { id: number; new_position: number }[]) => {
    setMediaDisplays((prev) =>
      sortItemsByPosition(structuredClone(prev), data)
    );
  };

  const insertItem = (newItem: MediaDisplayType) => {
    // We can do this because added items are automatically on the last. Handling of sequence will be different
    setMediaDisplays((prev) => [...prev, newItem]);
  };

  const updateItem = (id: number, updatedItem: MediaDisplayType) => {
    setMediaDisplays((prev) => {
      return prev.map((item) => (item.id == id ? updatedItem : item));
    });
  };

  const deleteItem = (id: number) => {
    setMediaDisplays((prev) => prev.filter((item) => item.id !== id));
  };

  useEffect(() => {
    fetchMediaDisplays();
  }, []);

  return {
    mediaDisplays,
    insertItem,
    updateItem,
    deleteItem,
    updateSequence,
    isLoading,
    isReady,
  };
};
export default useMediaDisplaysData;
