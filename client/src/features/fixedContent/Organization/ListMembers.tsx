import { FaTrash } from "react-icons/fa";
import IconWithTooltip from "../../../components/IconWithTooltip";
import { OrganizationMembersType } from "../../../types/FixedContentTypes";

type ListMembersProps = {
  members: OrganizationMembersType[];
  handleDelete: (id: number) => void;
};

const ListMembers = ({ members, handleDelete }: ListMembersProps) => {
  return (
    <div className="overflow-x-auto p-2 bg-white">
      <h2 className="text-xl font-semibold mb-4">Organization Members List</h2>
      <table className="min-w-full border rounded-lg">
        <thead className="bg-gray-200 dark:bg-gray-700">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Image</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Position</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {members.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center p-4 text-gray-500">
                No data retrieved
              </td>
            </tr>
          ) : (
            members.map((member) => (
              <tr
                key={member.id}
                className="border-b hover:bg-gray-100 dark:hover:bg-gray-800"
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
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
export default ListMembers;
