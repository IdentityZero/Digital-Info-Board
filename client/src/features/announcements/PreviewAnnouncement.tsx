import { AnnouncementRetrieveType } from "../../types/AnnouncementTypes";
import DetailAnnouncement from "./DetailAnnouncement";

type PreviewAnnouncementProps = {
  data: AnnouncementRetrieveType;
  setShowPreview: React.Dispatch<React.SetStateAction<boolean>>;
};

const PreviewAnnouncement = ({
  data,
  setShowPreview,
}: PreviewAnnouncementProps) => {
  /**
   * The state of the preview will be controlled by the parent
   * Ex.
   * {showPreview && (
           <PreviewAnnouncement
             setShowPreview={setShowPreview}
             data={dataToPreview as AnnouncementRetrieveType}
           />
         )}
   */
  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-gray-600 bg-opacity-90 z-50 flex flex-col overflow-auto ">
      <button
        className="text-5xl font-bold text-black hover:text-gray-800 active:text-gray-900 w-full text-right pr-12 mb-2"
        onClick={() => {
          setShowPreview(false);
        }}
      >
        &times;
      </button>
      <div className="">
        <DetailAnnouncement data={data} index={0} indexOnPlay={0} />
      </div>
    </div>
  );
};
export default PreviewAnnouncement;
