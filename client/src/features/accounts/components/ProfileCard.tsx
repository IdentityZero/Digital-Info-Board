import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

import IconWithTooltip from "../../../components/IconWithTooltip";
import Button from "./Button";

import { formatStringUnderscores } from "../../../utils/formatters";
import { FullUserType } from "../../../types/UserTypes";

type ProfileCardProps = {
  user: FullUserType;
  handleActivation: (id: string, activate: boolean) => void;
  handleDelete: (id: string) => void;
};

function ProfileCard({
  user,
  handleActivation,
  handleDelete,
}: ProfileCardProps) {
  return (
    <div key={user.id} className="w-full flex flex-col border border-black p-2">
      <p className="text-sm sm:text-base font-semibold capitalize w-full bg-cyanBlue p-2 sm:p-3 rounded-full flex items-center gap-2">
        {user.profile.is_admin && (
          <IconWithTooltip
            icon={FaCheckCircle}
            label="This user is an admin."
            labelClassName="bg-gray-800 text-white text-xs py-0.5 px-1.5 rounded shadow-md whitespace-nowrap z-50"
          />
        )}
        {user.first_name + " " + user.last_name}
      </p>

      <div className="w-full flex flex-col md:flex-row p-3 gap-3">
        {/* Profile Image */}
        <div className="w-full md:w-[120px] flex justify-center">
          <img
            src={user.profile.image as string}
            alt={`${user.username}'s Profile`}
            className="w-[100px] h-[100px] rounded-full border"
          />
        </div>

        {/* User Info */}
        <div className="w-full md:flex-1 px-0 sm:px-2 space-y-2 text-sm">
          {[
            { label: "Username:", value: user.username },
            { label: "ID Number:", value: user.profile.id_number },
            { label: "Role:", value: user.profile.role },
            {
              label: "Position:",
              value: formatStringUnderscores(user.profile.position),
            },
            {
              label: "Account Activated:",
              value: user.is_active ? (
                <FaCheckCircle className="text-green-500 text-base" />
              ) : (
                <FaTimesCircle className="text-red-500 text-base" />
              ),
            },
            {
              label: "Admin:",
              value: user.profile.is_admin ? (
                <FaCheckCircle className="text-green-500 text-base" />
              ) : (
                <FaTimesCircle className="text-red-500 text-base" />
              ),
            },
          ].map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center gap-1"
            >
              <span className="text-gray-600">{item.label}</span>
              <span className="text-black font-medium capitalize text-right">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-2 w-full flex flex-col sm:flex-row justify-end gap-2">
        <div className="w-full sm:w-auto">
          <Link to={`${user.id}`}>
            <Button text="View" type="button" />
          </Link>
        </div>
        <div className="w-full sm:w-auto">
          <Button
            text={user.is_active ? "Deactivate" : "Activate"}
            variant="secondary"
            type="button"
            onClick={() => handleActivation(user.id, !user.is_active)}
          />
        </div>
        <div className="w-full sm:w-auto">
          <Button
            text="Delete"
            variant="danger"
            type="button"
            onClick={() => handleDelete(user.id)}
          />
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
