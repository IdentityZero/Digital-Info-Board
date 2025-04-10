import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import {
  arrayMove,
  defaultAnimateLayoutChanges,
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import {
  AnnouncementListType,
  AnnouncementRetrieveType,
} from "../types/AnnouncementTypes";

import { AnnouncementThumbnail } from "../features/announcements";

type DragAndDropProps = {
  items: AnnouncementListType;
  setItems: React.Dispatch<React.SetStateAction<AnnouncementListType>>;
  containerSize?: string;
  disabled?: boolean;
  onThumbnailClick?: (data: AnnouncementRetrieveType) => void;
};

const DragAndDrop = ({
  items,
  setItems,
  disabled = false,
  containerSize = "100%",
  onThumbnailClick,
}: DragAndDropProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <div className="w-full">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToParentElement]}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={horizontalListSortingStrategy}
          disabled={disabled}
        >
          <div
            className={`flex flex-row gap-2 overflow-auto custom-scrollbar`}
            style={{ width: containerSize, margin: "0 auto" }}
          >
            {items.map((item, index) => (
              <DnDSortableItem key={item.id} id={item.id} editMode={!disabled}>
                <div
                  className={`bg-yellowishBeige w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] md:w-[120px] md:h-[120px] rounded-xl touch-none mb-1.5 overflow-hidden ${
                    index === 0 && "mr-3"
                  }`}
                >
                  <AnnouncementThumbnail
                    data={item}
                    onClick={onThumbnailClick}
                  />
                </div>
              </DnDSortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }
};

function animateLayoutChangeOnStationary(args: any) {
  const { isSorting, wasSorting } = args;

  if (isSorting || wasSorting) {
    return defaultAnimateLayoutChanges(args);
  }

  return true;
}

const DnDSortableItem = ({
  id,
  children,
  editMode,
}: {
  id: string;
  children: React.ReactNode;
  editMode: boolean;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      animateLayoutChanges: editMode
        ? defaultAnimateLayoutChanges
        : animateLayoutChangeOnStationary,
      id: id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
};

export { DnDSortableItem };
export default DragAndDrop;
