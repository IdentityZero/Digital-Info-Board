import { FaArrowLeft } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import RetrieveUserProfile from "../../../features/accounts/RetrieveUserProfile";

const ViewProfilePage = () => {
  /**
   * Viewing Profiles based on id
   */

  const { id } = useParams();

  return (
    <div className="p-4 mt-2">
      <div className="flex flex-col gap-2 border border-black p-4">
        <Link
          to="/dashboard/account/list-of-accounts"
          className="flex flex-row items-center gap-2 px-8 py-1 rounded-full border border-black bg-lightBlue hover:bg-lightBlue-300 active:bg-lightBlue-500 w-fit"
        >
          <FaArrowLeft />
          Back to list
        </Link>
        {id && <RetrieveUserProfile id={id} />}
      </div>
    </div>
  );
};
export default ViewProfilePage;
