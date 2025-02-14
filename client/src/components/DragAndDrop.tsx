import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  defaultAnimateLayoutChanges,
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AnnouncementListType } from "../types/AnnouncementTypes";
import { AnnouncementThumbnail } from "../features/announcements";

type DragAndDropProps = {
  items: AnnouncementListType;
  setItems: React.Dispatch<React.SetStateAction<AnnouncementListType>>;
  containerSize?: string;
  disabled?: boolean;
};

const DragAndDrop = ({
  items,
  setItems,
  disabled = false,
  containerSize = "100%",
}: DragAndDropProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <div className="w-full">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToHorizontalAxis]}
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
                  className={`bg-yellowishBeige w-[120px] h-[120px] rounded-xl touch-none mb-1.5 overflow-hidden ${
                    index === 0 && "mr-3"
                  }`}
                >
                  <AnnouncementThumbnail data={item} />
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
