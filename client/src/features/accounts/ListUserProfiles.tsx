import { FullUserType } from "../../types/UserTypes";

type ListUserProfilesProps = {
  usersList: FullUserType[];
  approveFunc: (id: string | number) => void;
};

const ListUserProfiles = ({
  usersList,
  approveFunc,
}: ListUserProfilesProps) => {
  return (
    <div className="flex flex-col gap-4">
      {usersList.map((user) => (
        <div key={user.id} className="w-full flex flex-col">
          <p className="text-lg font-semibold capitalize w-full bg-cyanBlue p-4 rounded-full">
            {user.first_name + " " + user.last_name}
          </p>
          <div className="w-full flex flex-row p-4 gap-4">
            <div className="w-1/5">
              <img
                src={user.profile.image as string}
                alt={`${user.username}'s Profile`}
                className="w-[150px] h-[150px] rounded-full border m-auto"
              />
            </div>

            <div className="p-6 w-1/3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Username:</span>
                <span className="text-black font-bold capitalize">
                  {user.username}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">ID Number:</span>
                <span className="text-black font-bold capitalize">
                  {user.profile.id_number}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Role:</span>
                <span className="text-black font-bold capitalize">
                  {user.profile.role}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Position:</span>
                <span className="text-black font-bold capitalize">
                  {user.profile.position}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-2 w-full flex justify-end">
            <button
              className={`py-2 px-16 rounded-full bg-cyanBlue hover:bg-cyanBlue-dark active:bg-cyanBlue-darker font-semibold `}
              type="button"
              onClick={() => approveFunc(user.id)}
            >
              Approve
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
export default ListUserProfiles;
