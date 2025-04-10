import { FaTrash } from "react-icons/fa";
import { CSS } from "@dnd-kit/utilities";

import { useSortable } from "@dnd-kit/sortable";

import IconWithTooltip from "../../../../components/IconWithTooltip";
import { OrganizationMembersType } from "../../../../types/FixedContentTypes";

type SortableTableRowProps = {
  member: OrganizationMembersType;
  isHighlighted: boolean;
  handleDelete: (id: number) => void;
  handleIDClick: (id: number) => void;
};

const SortableTableRow = ({
  member,
  isHighlighted = false,
  handleDelete,
  handleIDClick,
}: SortableTableRowProps) => {
  /**
   * Sortable Table row for Org Members
   */
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
      <td
        className="p-2 border text-center font-bold underline cursor-pointer"
        onClick={() => handleIDClick(member.id)}
      >
        {member.id}
      </td>
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
      <td className="p-2 border whitespace-nowrap">{member.name}</td>
      <td className="p-2 border whitespace-nowrap">{member.position}</td>
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
};

export default SortableTableRow;
