import { useEffect, useState } from "react";
import { FaExclamationCircle } from "react-icons/fa";
import { useLocation } from "react-router-dom";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToParentElement } from "@dnd-kit/modifiers";

import ClosableMessage from "../../../../components/ClosableMessage";
import { Button } from "../../../../components/ui";

import { getChangedObj } from "../../../../utils/utils";
import { MediaDisplayType } from "../../../../types/FixedContentTypes";
import SortableTableRow from "./SortableTableRow";
import UpdateModal from "./UpdateModal";

type ListMediaDisplays = {
  media: MediaDisplayType[];
  handleDelete: (id: number) => void;
  handleUpdatePriority: (arr: MediaDisplayType[]) => void;
  handleUpdate: (data: MediaDisplayType) => void;
  handleRefresh: () => void;
};

const ListMediaDisplays = ({
  media,
  handleDelete,
  handleUpdatePriority,
  handleUpdate,
  handleRefresh,
}: ListMediaDisplays) => {
  const { hash } = useLocation();
  const targetId = hash.substring(1);

  const [items, setItems] = useState(media);
  const idExists = items.some((item) => String(item.id) === targetId);

  const lowestPriority = Math.min(...items.map((item) => item.priority));

  const [targetUpdateId, setTargetUpdateId] = useState<number | null>(null);

  const handleIDClick = (id: number) => {
    setTargetUpdateId(id);
  };

  useEffect(() => {
    setItems(media);
  }, [media]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const updatedItems = arrayMove(items, oldIndex, newIndex);
        return updatedItems.map((item, index) => ({
          ...item,
          priority: index + lowestPriority,
        }));
      });
    }
  };

  return (
    <div className="overflow-x-auto p-2 bg-white">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-semibold text-sm sm:text-base md:text-lg mb-4">
          Media Display List
        </h2>
        {media.length === items.length &&
          getChangedObj(media, items).length > 0 && (
            <Button type="button" onClick={() => handleUpdatePriority(items)}>
              Update priority
            </Button>
          )}
      </div>
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
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToParentElement]}
      >
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <table className="min-w-full border rounded-lg text-sm sm:text-base">
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                <th className="p-2 border">ID</th>
                <th className="p-2 border">File</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {media.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-4 text-gray-500">
                    No data retrieved
                  </td>
                </tr>
              ) : (
                items.map((medium) => (
                  <SortableTableRow
                    isHighlighted={String(medium.id) == targetId}
                    medium={medium}
                    handleDelete={handleDelete}
                    key={medium.id}
                    handleIDClick={handleIDClick}
                  />
                ))
              )}
            </tbody>
          </table>
        </SortableContext>
      </DndContext>
      {targetUpdateId && (
        <UpdateModal
          id={targetUpdateId}
          onClose={() => setTargetUpdateId(null)}
          onSuccess={handleUpdate}
          refreshList={handleRefresh}
        />
      )}
    </div>
  );
};
export default ListMediaDisplays;
