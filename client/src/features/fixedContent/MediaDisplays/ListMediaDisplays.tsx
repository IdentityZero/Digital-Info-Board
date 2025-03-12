import { FaTrash } from "react-icons/fa";

import IconWithTooltip from "../../../components/IconWithTooltip";

import { MediaDisplayType } from "../../../types/FixedContentTypes";

type ListMediaDisplays = {
  media: MediaDisplayType[];
  handleDelete: (id: number) => void;
};

const ListMediaDisplays = ({ media, handleDelete }: ListMediaDisplays) => {
  return (
    <div className="overflow-x-auto p-2 bg-white">
      <h2 className="text-xl font-semibold mb-4">Media Display List</h2>
      <table className="min-w-full border rounded-lg">
        <thead className="bg-gray-200 dark:bg-gray-700">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">File</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {media.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center p-4 text-gray-500">
                No data retrieved
              </td>
            </tr>
          ) : (
            media.map((medium) => (
              <tr
                key={medium.id}
                className="border-b hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <td className="p-2 border text-center">{medium.id}</td>
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
                  <button
                    className="w-fit h-fit"
                    onClick={() => handleDelete(medium.id)}
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
export default ListMediaDisplays;
