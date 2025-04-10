import { useState, memo } from "react";
import DragAndDrop from "../../../components/DragAndDrop";

import {
  AnnouncementListType,
  AnnouncementRetrieveType,
} from "../../../types/AnnouncementTypes";
import { getChangedObj } from "../../../utils/utils";
import ChangeDurationModal from "./ChangeDurationModal";

type ChangeTimeDurationProps = {
  sliderItems: AnnouncementListType;
};

const ChangeTimeDuration = ({ sliderItems }: ChangeTimeDurationProps) => {
  const [items, setItems] = useState(structuredClone(sliderItems));
  const [targetData, setTargetData] = useState<AnnouncementRetrieveType | null>(
    null
  );

  const handleThumbnailClick = (data: AnnouncementRetrieveType) => {
    setTargetData(data);
  };

  return (
    <div className="w-full h-[180px] bg-darkTeal border border-black rounded-lg overflow-hidden px-4 py-6 flex flex-col justify-between">
      <div className="flex flex-row gap-2 justify-between h-[150px]">
        <DragAndDrop
          items={items}
          setItems={setItems}
          disabled
          onThumbnailClick={handleThumbnailClick}
        />
      </div>

      <div className="flex flex-row justify-end px-6">
        <button
          className="px-8 rounded-full bg-cyanBlue hover:bg-cyanBlue-dark active:bg-cyanBlue-darker text-white border border-black font-semibold text-xs uppercase"
          type="submit"
        >
          Save
        </button>
      </div>
      {targetData && (
        <ChangeDurationModal
          isOpen={!!targetData}
          onClose={() => setTargetData(null)}
          announcementData={targetData}
        />
      )}
    </div>
  );
};
const areEqual = (prevProps: any, nextProps: any) => {
  const changed = getChangedObj(prevProps.sliderItems, nextProps.sliderItems);

  return changed.length !== 0;
};

export default memo(ChangeTimeDuration, areEqual);
