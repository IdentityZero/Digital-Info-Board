import { useEffect, useRef, useState } from "react";
import {
  FIXED_CONTENTS,
  FixedContentType,
  getActiveFixedContents,
} from "../../features/fixedContent/constant";
import LoadingMessage from "../../components/LoadingMessage";
import { updateFixedContentStatus } from "../../api/fixedContentRquests";
import { useAuth } from "../../context/AuthProvider";
import { Id } from "react-toastify";
import useLoadingToast from "../../hooks/useLoadingToast";

const DefaultDisplayPage = () => {
  const toastId = useRef<Id | null>(null);
  const { loading, update } = useLoadingToast(toastId);
  const { userApi } = useAuth();

  const [activeContents, setActiveContents] = useState<FixedContentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasFetchingError, setHasFetchingError] = useState(false);

  useEffect(() => {
    const fetchActiveContents = async () => {
      try {
        setHasFetchingError(false);
        setIsLoading(true);
        const resData = await getActiveFixedContents();
        setActiveContents(resData);
      } catch {
        setHasFetchingError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchActiveContents();
  }, []);

  const handleDisplayState = async (id: number, isDisplayed: boolean) => {
    const save_confirm = window.confirm(
      `Are you sure you want to ${
        isDisplayed ? "REMOVE this from" : "ADD this to"
      } the Display? `
    );

    if (!save_confirm) return;
    loading(
      isDisplayed
        ? "Removing from Display. Please wait..."
        : "Adding to Display. Please wait..."
    );

    try {
      await updateFixedContentStatus(userApi, id, !isDisplayed);

      if (isDisplayed) {
        const updatedActiveContents = activeContents.filter(
          (content) => content.id !== id
        );
        setActiveContents(updatedActiveContents);
      } else {
        setActiveContents((prev) => {
          const newData = FIXED_CONTENTS.find((content) => content.id === id);

          return newData ? [...prev, newData] : [...prev];
        });
      }

      update({
        render: isDisplayed
          ? "Update Successful. Display Removed."
          : "Update Successful. Display Added.",
        type: "success",
      });
    } catch (error) {
      update({
        render: "Update unsuccessful. Please try again.",
        type: "error",
      });
    }
  };

  if (isLoading) return <LoadingMessage message="Loading contents..." />;
  if (hasFetchingError) return <div>There was an error loading your data.</div>;

  return (
    <div className="mt-2 p-4 flex flex-col gap-4">
      {activeContents &&
        FIXED_CONTENTS.map((content) => (
          <DefaultDisplayCard
            key={content.id}
            content={content}
            isDisplayed={activeContents.some(
              (activeContent) => activeContent.id === content.id
            )}
            handleDisplayState={handleDisplayState}
          />
        ))}
    </div>
  );
};

type DefaultDisplayCardProps = {
  content: FixedContentType;
  isDisplayed: boolean;
  handleDisplayState: (id: number, isDisplayed: boolean) => void;
};

function DefaultDisplayCard({
  content,
  isDisplayed,
  handleDisplayState,
}: DefaultDisplayCardProps) {
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const { id, title, component: Component } = content;

  return (
    <>
      <div className="border border-black bg-white p-2 flex flex-col gap-2">
        <p className="bg-cyanBlue p-2 font-semibold rounded-full">{title}</p>
        <div className="flex items-center justify-end gap-2">
          <button
            className="py-2 px-4 rounded-full bg-cyanBlue hover:bg-cyanBlue-dark active:bg-cyanBlue-darker font-semibold"
            onClick={() => {
              setIsPreviewMode(true);
            }}
          >
            Preview
          </button>
          <button
            className="py-2 px-4 rounded-full bg-cyanBlue hover:bg-cyanBlue-dark active:bg-cyanBlue-darker font-semibold min-w-[190px]"
            onClick={() => handleDisplayState(id, isDisplayed)}
          >
            {isDisplayed ? "Remove from" : "Add to"} Display
          </button>
        </div>
      </div>
      {isPreviewMode && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-gray-600 bg-opacity-90 z-50 flex flex-col overflow-auto ">
          <button
            className="text-5xl font-bold text-black hover:text-gray-800 active:text-gray-900 w-full text-right pr-12 mb-2"
            onClick={() => {
              setIsPreviewMode(false);
            }}
          >
            &times;
          </button>
          <div className="max-h-[80%] w-auto flex flex-col gap-2 items-center">
            <p className="text-white text-xl">{title}</p>

            {<Component />}
          </div>
        </div>
      )}
    </>
  );
}

export default DefaultDisplayPage;
