import { useState } from "react";
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
import { OrganizationMembersType } from "../../../types/FixedContentTypes";
import { Button } from "../../../components/ui";

type ListMembersProps = {
  members: OrganizationMembersType[];
  handleDelete: (id: number) => void;
  handleUpdatePriority: (arr: OrganizationMembersType[]) => void;
};

const ListMembers = ({
  members,
  handleDelete,
  handleUpdatePriority,
}: ListMembersProps) => {
  const [items, setItems] = useState(members);
  const lowestPriority = Math.min(...items.map((item) => item.priority));
  const [hasChange, setHasChange] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
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
      setHasChange(true);
    }
  };

  return (
    <div className="overflow-x-auto p-4 bg-white">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold mb-4">
          Organization Members List
        </h2>
        {hasChange && (
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
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Priority</th>
                <th className="p-2 border">Image</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Position</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-4 text-gray-500">
                    No data retrieved
                  </td>
                </tr>
              ) : (
                items.map((member) => (
                  <SortableTableRow
                    key={member.id}
                    member={member}
                    handleDelete={handleDelete}
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
export default ListMembers;

type SortableTableRowProps = {
  member: OrganizationMembersType;
  handleDelete: (id: number) => void;
};

function SortableTableRow({ member, handleDelete }: SortableTableRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: member.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="border hover:bg-gray-100 cursor-grab"
    >
      <td className="p-2 border text-center">{member.id}</td>
      <td className="p-2 border text-center">{member.priority}</td>
      <td className="p-2 border text-center">
        {member.image ? (
          <img
            src={member.image}
            alt={member.name}
            className="w-10 h-10 rounded-full object-cover border mx-auto"
          />
        ) : (
          <span className="text-gray-400">No Image</span>
        )}
      </td>
      <td className="p-2 border">{member.name}</td>
      <td className="p-2 border">{member.position}</td>
      <td className="p-2 text-center">
        <button onClick={() => handleDelete(member.id)}>
          <IconWithTooltip
            icon={FaTrash}
            label="Delete"
            iconClassName="text-xl text-red-600 hover:text-red-700 active:text-red-800 cursor-pointer"
            labelClassName="p-1 px-2 rounded-md shadow-md bg-red-600 text-white text-center"
          />
        </button>
      </td>
    </tr>
  );
}
