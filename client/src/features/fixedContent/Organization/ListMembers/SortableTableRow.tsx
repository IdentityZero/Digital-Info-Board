import { FaEdit, FaTrash } from "react-icons/fa";
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
      className={`border cursor-grab transition-shadow duration-200 h-full ${
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
      <td className="p-2">
        <div className="h-full flex justify-center items-center gap-4">
          <button onClick={() => handleIDClick(member.id)} data-no-dnd={true}>
            <IconWithTooltip
              icon={FaEdit}
              label="Edit"
              iconClassName="text-xl text-btPrimary hover:text-btPrimary-hover active:text-btPrimary-active cursor-pointer"
              labelClassName="p-1 px-2 rounded-md shadow-md bg-btPrimary-hover text-white text-center"
            />
          </button>
          <button
            className="w-fit h-fit"
            onClick={() => handleDelete(member.id)}
          >
            <IconWithTooltip
              icon={FaTrash}
              label="Delete"
              iconClassName="text-xl text-btDanger hover:text-btDanger-hover active: active:text-btDanger-active cursor-pointer"
              labelClassName="p-1 px-2 rounded-md shadow-md bg-btDanger text-white text-center"
            />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default SortableTableRow;
