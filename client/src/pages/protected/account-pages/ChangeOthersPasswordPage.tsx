import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import LoadingMessage from "../../../components/LoadingMessage";
import { retrieveUserInformation } from "../../../api/userRequest";
import { useAuth } from "../../../context/AuthProvider";

const ChangeOthersPasswordPage = () => {
  // TODO: THIS IS A MAJOR SECURITY RISK. DO THIS BETTER
  const { id } = useParams();
  const { userApi } = useAuth();
  const [userExists, setUserExists] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await retrieveUserInformation(userApi, id as string);
        setUserExists(true);
      } catch (error) {
        setUserExists(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (isLoading) {
    return (
      <div className="p-4 mt-2">
        <LoadingMessage message="Loading..." />
      </div>
    );
  }

  if (!isLoading && !userExists) {
    return (
      <div className="p-4 mt-2">
        <Link
          to={`/dashboard/account/list-of-accounts/`}
          className="flex flex-row items-center gap-2 px-8 py-1 rounded-full border border-black bg-lightBlue hover:bg-lightBlue-300 active:bg-lightBlue-500 w-fit"
        >
          <FaArrowLeft />
          Back to List
        </Link>
        <p>You are not allowed to do this operation</p>
      </div>
    );
  }

  return (
    <div className="p-4 mt-2 flex flex-col gap-4">
      <Link
        to={`/dashboard/account/list-of-accounts/${id}`}
        className="flex flex-row items-center gap-2 px-8 py-1 rounded-full border border-black bg-lightBlue hover:bg-lightBlue-300 active:bg-lightBlue-500 w-fit"
      >
        <FaArrowLeft />
        Back to Profile
      </Link>
      <div>For Questioning...</div>
    </div>
  );
};
export default ChangeOthersPasswordPage;
