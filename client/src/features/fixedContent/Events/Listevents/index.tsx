import { FaExclamationCircle, FaTrash } from "react-icons/fa";
import { useLocation } from "react-router-dom";

import ClosableMessage from "../../../../components/ClosableMessage";
import IconWithTooltip from "../../../../components/IconWithTooltip";
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
      <h2 className="text-xl font-semibold mb-4">Upcoming Events List</h2>
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
      <table className="min-w-full border rounded-lg">
        <thead className="bg-gray-200 dark:bg-gray-700">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Event Name</th>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
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
                <td className="p-2 border text-center">{event.name}</td>
                <td className="p-2 border text-center">
                  {formatInputDate(event.date)}
                </td>

                <td className="p-2 text-center">
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
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
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
