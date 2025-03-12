import { FaTrash } from "react-icons/fa";
import IconWithTooltip from "../../../components/IconWithTooltip";
import { UpcomingEventType } from "../../../types/FixedContentTypes";
import { formatInputDate } from "../../../utils/formatters";

type ListEventsProps = {
  events: UpcomingEventType[];
  handleDelete: (id: number) => void;
};

const ListEvents = ({ events, handleDelete }: ListEventsProps) => {
  return (
    <div className="overflow-x-auto p-2">
      <h2 className="text-xl font-semibold mb-4">Upcoming Events List</h2>
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
                key={event.id}
                className="border-b hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <td className="p-2 border text-center">{event.id}</td>
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
    </div>
  );
};
export default ListEvents;
