import { useRef, useState } from "react";
import { Id, toast } from "react-toastify";

import FormField from "./components/FormField";
import SelectField from "./components/SelectField";
import Button from "./components/Button";

import useLoadingToast from "../../hooks/useLoadingToast";
import { useAuth } from "../../context/AuthProvider";

import { formatStringUnderscores } from "../../utils/formatters";
import {
  CreateUserInvitationType,
  Faculty,
  RetrieveUserInvitationType,
  Role,
  Student,
} from "../../types/UserTypes";
import { get_role_positions } from "../../constants";

import { createUserInvitationApi } from "../../api/userRequest";
import {
  CreateInvitationErrorInitialState,
  CreateInvitationFormDataInitialState,
} from "./helpers";
import axios from "axios";

type SendInvitationProps = {
  addInvitation?: (item: RetrieveUserInvitationType) => void;
};

const SendInvitation = ({ addInvitation }: SendInvitationProps) => {
  const toastId = useRef<Id | null>(null);
  const { loading, update } = useLoadingToast(toastId);
  const { userApi } = useAuth();

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(CreateInvitationErrorInitialState);

  const [formData, setFormData] = useState(
    CreateInvitationFormDataInitialState
  );
  const [positionOptions, setPositionOptions] = useState<
    Student["position"][] | Faculty["position"][]
  >([]);

  const roles: Role["role"][] = ["faculty", "student"];

  const sendInvitation = (item: RetrieveUserInvitationType) => {
    addInvitation?.(item);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => {
      const updatedFormData = { ...prevFormData, [name]: value };

      if (name === "role") {
        setPositionOptions(get_role_positions(value as "student" | "faculty"));
        updatedFormData.position = "";
      }

      return updatedFormData;
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    loading("Sending Invitation...");

    try {
      setIsSaving(true);
      const res_data = await createUserInvitationApi(
        userApi,
        formData as CreateUserInvitationType
      );
      update({
        render: "Invitation Created.",
        type: "success",
      });

      if (res_data) {
        toast.success("Invitation Sent to email.");
      } else {
        toast.warning(
          "Server is not connected to the internet. Try resending the email again later."
        );
      }
      sendInvitation(res_data);

      setFormData(CreateInvitationFormDataInitialState);
      setError(CreateInvitationErrorInitialState);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const err = error.response?.data;
        if (!err) {
          update({
            render: "Saving Unsuccesful. Please try again.",
            type: "error",
          });
          return;
        }
        setError((prev) => ({
          ...prev,
          ...err,
        }));
        update({
          render: "Please check errors before submitting again.",
          type: "warning",
        });
      } else {
        update({
          render: "Saving Unsuccesful. Please try again.",
          type: "error",
        });
        return;
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4">Send Invitation</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="col-span-1 md:col-span-2">
            <FormField
              labelText="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              type="email"
              placeholder="Enter email"
              disabled={isSaving}
              error={error.email}
            />
          </div>

          <SelectField
            labelText="Role"
            name="role"
            onChange={handleChange}
            required
            value={formData.role}
            disabled={isSaving}
            error={error.role}
          >
            <option value="">Select Role</option>
            {roles.map((role) => (
              <option value={role} className="capitalize" key={role}>
                {role}
              </option>
            ))}
          </SelectField>

          <SelectField
            labelText="Position"
            name="position"
            onChange={handleChange}
            required
            value={formData.position}
            disabled={formData.role === "" || isSaving}
            error={error.position}
          >
            <option value="">Select Position</option>
            {positionOptions.map((position) => (
              <option value={position} className="capitalize" key={position}>
                {formatStringUnderscores(position)}
              </option>
            ))}
          </SelectField>
        </div>
        <div className="mt-2">
          <Button text="Send Invitation" type="submit" disabled={isSaving} />
        </div>
      </form>
    </div>
  );
};
export default SendInvitation;
