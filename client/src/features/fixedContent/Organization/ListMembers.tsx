import { useEffect, useState } from "react";
import { FaExclamationCircle, FaTrash } from "react-icons/fa";
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
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToParentElement } from "@dnd-kit/modifiers";

import ClosableMessage from "../../../components/ClosableMessage";
import IconWithTooltip from "../../../components/IconWithTooltip";
import { Button } from "../../../components/ui";

import { getChangedObj } from "../../../utils/utils";

import { OrganizationMembersType } from "../../../types/FixedContentTypes";

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
  const { hash } = useLocation();
  const targetId = hash.substring(1);

  const [items, setItems] = useState(members);
  const idExists = items.some((item) => String(item.id) === targetId);

  const lowestPriority = Math.min(...items.map((item) => item.priority));

  useEffect(() => {
    setItems(members);
  }, [members]);

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
    <div className="overflow-x-auto p-4 bg-white">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold mb-4">
          Organization Members List
        </h2>
        {members.length === items.length &&
          getChangedObj(members, items).length > 0 && (
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
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 border">ID</th>
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
                    isHighlighted={String(member.id) == targetId}
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
  isHighlighted: boolean;
  handleDelete: (id: number) => void;
};

function SortableTableRow({
  member,
  isHighlighted = false,
  handleDelete,
}: SortableTableRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: member.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition,
  };

  return (
    <tr
      id={String(member.id)}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`border cursor-grab transition-shadow duration-200 ${
        isHighlighted
          ? "shadow-[0_0_10px_rgba(0,150,255,0.7)]"
          : "hover:bg-gray-100 dark:hover:bg-gray-800"
      }`}
    >
      <td className="p-2 border text-center">{member.id}</td>
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
        <button onClick={() => handleDelete(member.id)} data-no-dnd={true}>
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
