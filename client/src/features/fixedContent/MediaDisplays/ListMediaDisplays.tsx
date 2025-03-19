import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";

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
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToParentElement } from "@dnd-kit/modifiers";

import IconWithTooltip from "../../../components/IconWithTooltip";

import { MediaDisplayType } from "../../../types/FixedContentTypes";
import { getChangedObj } from "../../../utils/utils";
import { Button } from "../../../components/ui";

type ListMediaDisplays = {
  media: MediaDisplayType[];
  handleDelete: (id: number) => void;
  handleUpdatePriority: (arr: MediaDisplayType[]) => void;
};

const ListMediaDisplays = ({
  media,
  handleDelete,
  handleUpdatePriority,
}: ListMediaDisplays) => {
  const [items, setItems] = useState(media);
  const lowestPriority = Math.min(...items.map((item) => item.priority));

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
        <h2 className="text-xl font-semibold mb-4">Media Display List</h2>
        {media.length === items.length &&
          getChangedObj(media, items).length > 0 && (
            <Button type="button" onClick={() => handleUpdatePriority(items)}>
              Update priority
            </Button>
          )}
      </div>

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
          <table className="min-w-full border rounded-lg">
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">File</th>
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
                    medium={medium}
                    handleDelete={handleDelete}
                    key={medium.id}
                  />
                ))
              )}
            </tbody>
          </table>
        </SortableContext>
      </DndContext>
    </div>
  );
};
export default ListMediaDisplays;

type SortableTableRowProps = {
  medium: MediaDisplayType;
  handleDelete: (id: number) => void;
};

function SortableTableRow({ medium, handleDelete }: SortableTableRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: medium.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition,
  };
  return (
    <tr
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="border-b hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      <td className="p-2 border text-center">{medium.id}</td>
      <td className="p-2 border text-center">
        {medium.file ? (
          medium.type === "image" ? (
            <img
              src={medium.file}
              alt={medium.name}
              className="max-h-[200px] max-w-[300px] mx-auto"
            />
          ) : (
            <video
              src={medium.file}
              className="max-h-[200px] max-w-[300px] mx-auto"
              controls
            >
              Not supported.
            </video>
          )
        ) : (
          <span className="text-gray-400">No file</span>
        )}
      </td>
      <td className="p-2 border">{medium.name}</td>

      <td className="p-2 text-center">
        <button className="w-fit h-fit" onClick={() => handleDelete(medium.id)}>
          <IconWithTooltip
            icon={FaTrash}
            label="Delete"
            iconClassName="text-xl text-btDanger hover:text-btDanger-hover active: active:text-btDanger-active cursor-pointer"
            labelClassName="p-1 px-2 rounded-md shadow-md bg-btDanger text-white text-center"
          />
        </button>
      </td>
    </tr>
  );
}
