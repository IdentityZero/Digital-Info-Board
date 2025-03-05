import { Link } from "react-router-dom";

const SuccessSignup = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
        <h1 className="text-2xl font-bold text-gray-800">
          Account Created Successfully!
        </h1>
        <p className="mt-4 text-gray-600">
          Your account is now active! Start creating meaningful content and
          announcements for our department and campus.
        </p>
        <div className="mt-6 flex flex-col gap-3 w-full">
          <Link
            to="/login"
            className="px-6 py-2 text-white bg-green-500 rounded-lg shadow hover:bg-green-600 transition duration-200"
          >
            Login to Your Account
          </Link>
          <Link
            to="/about-us"
            className="px-6 py-2 text-white bg-blue-500 rounded-lg shadow hover:bg-blue-600 transition duration-200"
          >
            Explore About Us
          </Link>
        </div>
      </div>
    </div>
  );
};
export default SuccessSignup;
