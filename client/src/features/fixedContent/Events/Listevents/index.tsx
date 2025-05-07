import { FaEdit, FaExclamationCircle, FaTrash } from "react-icons/fa";
import { useLocation } from "react-router-dom";

import ClosableMessage from "../../../../components/ClosableMessage";
import IconWithTooltip from "../../../../components/IconWithTooltip";
import Table from "../../../../components/ui/Table/Table";
import Thead from "../../../../components/ui/Table/Thead";
import { formatInputDate } from "../../../../utils/formatters";

import { UpcomingEventType } from "../../../../types/FixedContentTypes";
import { useState } from "react";
import UpdateModal from "./UpdateModal";

type ListEventsProps = {
  events: UpcomingEventType[];
  handleDelete: (id: number) => void;
  handleUpdate: (updatedData: UpcomingEventType) => void;
  handleRefresh: () => void;
};

const ListEvents = ({
  events,
  handleDelete,
  handleUpdate,
  handleRefresh,
}: ListEventsProps) => {
  const { hash } = useLocation();
  const targetId = hash.substring(1);

  const idExists = events.some((item) => String(item.id) === targetId);

  const [targetUpdateId, setTargetUpdateId] = useState<number | null>(null);

  return (
    <div className="overflow-x-auto p-2">
      <h2 className="font-semibold text-sm sm:text-base md:text-lg mb-4">
        Upcoming Events List
      </h2>
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
      <Table>
        <Thead headers={["ID", "Event Name", "Date", "Action"]} />
        <tbody>
          {events.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center p-4 text-gray-500">
                No data retrieved
              </td>
            </tr>
          ) : (
            events.map((event) => (
              <tr
                id={String(event.id)}
                key={event.id}
                className={`border cursor-grab transition-shadow duration-200 ${
                  String(event.id) === targetId
                    ? "shadow-[0_0_10px_rgba(0,150,255,0.7)]"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <td
                  className="p-2 border text-center font-bold cursor-pointer underline"
                  onClick={() => setTargetUpdateId(event.id)}
                >
                  {event.id}
                </td>
                <td className="p-2 border text-center whitespace-nowrap">
                  {event.name}
                </td>
                <td className="p-2 border text-center whitespace-nowrap">
                  {formatInputDate(event.date)}
                </td>

                <td className="p-2">
                  <div className="h-full flex justify-center items-center gap-4">
                    <button
                      onClick={() => setTargetUpdateId(event.id)}
                      data-no-dnd={true}
                    >
                      <IconWithTooltip
                        icon={FaEdit}
                        label="Edit"
                        iconClassName="text-xl text-btPrimary hover:text-btPrimary-hover active:text-btPrimary-active cursor-pointer"
                        labelClassName="p-1 px-2 rounded-md shadow-md bg-btPrimary-hover text-white text-center"
                      />
                    </button>
                    <button
                      className="w-fit h-fit"
                      onClick={() => handleDelete(event.id)}
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
            ))
          )}
        </tbody>
      </Table>
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
export default ListEvents;
