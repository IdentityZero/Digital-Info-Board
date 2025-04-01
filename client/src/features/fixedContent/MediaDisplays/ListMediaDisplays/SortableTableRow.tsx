import { FaTrash } from "react-icons/fa";
import IconWithTooltip from "../../../../components/IconWithTooltip";
import { MediaDisplayType } from "../../../../types/FixedContentTypes";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type SortableTableRowProps = {
  medium: MediaDisplayType;
  isHighlighted: boolean;
  handleDelete: (id: number) => void;
  handleIDClick: (id: number) => void;
};

const SortableTableRow = ({
  medium,
  isHighlighted = false,
  handleDelete,
  handleIDClick,
}: SortableTableRowProps) => {
  /**
   * Sortable Table row for Media Displays
   *
   */
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: medium.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition,
  };
  return (
    <tr
      id={String(medium.id)}
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
        onClick={() => handleIDClick(medium.id)}
      >
        {medium.id}
      </td>
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
};

export default SortableTableRow;
