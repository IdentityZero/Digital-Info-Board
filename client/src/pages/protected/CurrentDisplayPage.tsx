import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { customCircle } from "../../assets";
import DragAndDrop from "../../components/DragAndDrop";
import LoadingMessage from "../../components/LoadingMessage";
import { AnnouncementCarousel } from "../../features/announcements";
import useAnnouncementSlider from "../../features/announcements/hooks/useAnnouncementSlider";
import {
  calculateElapsedTime,
  findIndexByWeight,
  moveFirstToLast,
} from "../../utils/utils";
import { LIVE_ANNOUNCEMENT_URL } from "../../constants/urls";
import useSiteSettings from "../../hooks/useSiteSettings";

const CurrentDisplayPage = () => {
  const {
    announcements,
    setAnnouncements,
    sliderItems,
    setSliderItems,
    sliderItemsForEdit,
    setSliderItemsForEdit,
    isLoading,
    durations,
  } = useAnnouncementSlider();
  const { settings } = useSiteSettings();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [carouselIndex, setCarouselIndex] = useState<number | undefined>(
    undefined
  );

  // For Syncing
  const [carouselStartInterval, setCarouselStartInterval] = useState<
    number | undefined
  >(undefined);
  const [useStartInterval, setUseStartInterval] = useState(true);

  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Slider
  useEffect(() => {
    if (!announcements || announcements.length === 0 || !carouselStartInterval)
      return;
    const interval = setInterval(
      () => {
        handleNext();
      },
      useStartInterval ? carouselStartInterval : durations[currentIndex] || 5000
    );

    if (useStartInterval) {
      setUseStartInterval(false);
    }

    return () => clearInterval(interval);
  }, [announcements, currentIndex]);

  // Websocket
  useEffect(() => {
    const ws = new WebSocket(LIVE_ANNOUNCEMENT_URL);
    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  // Sync
  useEffect(() => {
    if (!settings || announcements.length === 0) return;
    if (!useStartInterval) return;

    const elapsedTime = calculateElapsedTime(settings.announcement_start);
    const totalDuration = durations.reduce(
      (acc, duration) => acc + duration,
      0
    );
    const remainingTime = elapsedTime % totalDuration;
    const startIndex = findIndexByWeight(durations, remainingTime);

    const startIndexRemainingTime = (): number => {
      let sum = 0;

      durations.some((duration, index) => {
        sum += duration;
        return index === startIndex;
      });

      return sum - remainingTime;
    };

    setCarouselStartInterval(startIndexRemainingTime());
    setCarouselIndex(startIndex + 1);

    // Adjust the slider contents
    for (let i = 0; i < startIndex; i++) {
      moveFirstToLast(sliderItems);
    }
  }, [settings, announcements]);

  const handleNext = () => {
    setSliderItems((prevItems) => {
      const newItems = structuredClone(prevItems);
      moveFirstToLast(newItems);
      return newItems;
    });

    if (currentIndex >= announcements.length - 1) {
      setCurrentIndex(0);
      return;
    }
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const handleSave = () => {
    setIsEditMode(false);

    if (socket?.readyState !== WebSocket.OPEN) {
      toast.error("Update unsuccessful. Try refreshing the page.");
      return;
    }

    setAnnouncements(structuredClone(sliderItemsForEdit));
    setSliderItems(structuredClone(sliderItemsForEdit));

    const wsMessage = sliderItemsForEdit.map((item, index) => ({
      new_position: index + 1,
      id: item.id,
    }));

    socket?.send(JSON.stringify({ type: "new_sequence", message: wsMessage }));
    setCurrentIndex(0);
    toast.success("Updated Successfully.");
  };

  if (!carouselIndex || !carouselStartInterval || isLoading) {
    if (!announcements) {
      return (
        <div className="mt-4">
          <LoadingMessage message="Loading and Syncing data..." />;
        </div>
      );
    } else if (announcements.length === 0) {
      return (
        <div className="mt-4 text-center">
          Looks like we do not have Active Contents yet.
        </div>
      );
    }
  }

  return (
    <div className="p-2">
      <h1 className="ml-8 font-extrabold uppercase text-xl tracking-wider">
        Now Playing!
      </h1>
      <div className="flex flex-row max-xl:flex-col h-full">
        <div className="w-1/2 max-xl:w-full h-full p-4">
          <div className="w-full h-full border-[6px] border-darkTeal rounded-md overflow-hidden">
            {carouselIndex && (
              <AnnouncementCarousel
                announcements={announcements}
                durations={durations}
                index={carouselIndex}
                startInterval={carouselStartInterval}
              />
            )}
          </div>
        </div>
        <div className="w-1/2 max-xl:w-full h-full">
          <div className="px-5">
            <CustomTitleHolder text="Up next" />
            <div className="w-full h-[250px] bg-darkTeal border border-black rounded-lg overflow-hidden px-4 py-6 flex flex-col justify-between">
              {announcements && (
                <>
                  <DragAndDrop
                    items={isEditMode ? sliderItemsForEdit : sliderItems}
                    setItems={
                      isEditMode ? setSliderItemsForEdit : setSliderItems
                    }
                    disabled={!isEditMode}
                  />
                  <div className="flex flex-row justify-end px-6">
                    {isEditMode ? (
                      <button
                        className={`px-8 rounded-full bg-cyanBlue hover:bg-cyanBlue-dark active:bg-cyanBlue-darker text-white border border-black font-semibold text-xs uppercase`}
                        onClick={handleSave}
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        className={`px-8 rounded-full bg-cyanBlue hover:bg-cyanBlue-dark active:bg-cyanBlue-darker text-white border border-black font-semibold text-xs uppercase`}
                        onClick={() => setIsEditMode(true)}
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="px-5">
            <CustomTitleHolder text="Edit Context" />
            <div className="w-full h-[250px] bg-darkTeal border border-black rounded-lg overflow-hidden px-4 py-6 flex flex-col justify-between">
              <div className="flex flex-row gap-2 justify-between h-[150px] bg-yellowishBeige p-4">
                <button
                  className={`px-8 py-2 h-fit rounded-full bg-cyanBlue hover:bg-cyanBlue-dark active:bg-cyanBlue-darker text-white border border-black font-semibold text-xs uppercase`}
                  type="submit"
                >
                  Change template
                </button>
                <button
                  className={`px-8 py-2 h-fit rounded-full bg-cyanBlue hover:bg-cyanBlue-dark active:bg-cyanBlue-darker text-white border border-black font-semibold text-xs uppercase`}
                  type="submit"
                >
                  Change Time Duration
                </button>
              </div>
              <div className="flex flex-row justify-end px-6">
                <button
                  className={`px-8 rounded-full bg-cyanBlue hover:bg-cyanBlue-dark active:bg-cyanBlue-darker text-white border border-black font-semibold text-xs uppercase`}
                  type="submit"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function CustomTitleHolder({ text }: { text: string }) {
  return (
    <div className="flex flex-row items-center py-2">
      <img src={customCircle} className="w-14 h-14" />
      <div className="bg-[linear-gradient(to_right,_transparent_2px,_#38b6ff_20px,_#38b6ff)] py-1.5 px-8 -ml-8 rounded-br-full">
        <p className="text-white uppercase font-bold text-xs">{text}</p>
      </div>
    </div>
  );
}

export default CurrentDisplayPage;
