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
    <div className="w-full bg-darkTeal border border-black rounded-lg overflow-hidden px-4 py-6 flex flex-col justify-between">
      <DragAndDrop
        items={items}
        setItems={setItems}
        disabled
        onThumbnailClick={handleThumbnailClick}
      />

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
