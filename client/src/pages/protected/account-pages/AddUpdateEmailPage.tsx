import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import AddEmail from "../../../features/accounts/AddEmail";

const AddUpdateEmailPage = () => {
  return (
    <div className="p-4 mt-2 flex flex-col gap-4">
      <Link
        to="/dashboard/account"
        className="flex flex-row items-center gap-2 px-8 py-1 rounded-full border border-black bg-lightBlue hover:bg-lightBlue-300 active:bg-lightBlue-500 w-fit"
      >
        <FaArrowLeft />
        Back to Profile
      </Link>
      <AddEmail />
    </div>
  );
};
export default AddUpdateEmailPage;
