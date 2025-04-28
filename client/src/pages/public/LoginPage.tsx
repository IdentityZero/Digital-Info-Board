import { Link } from "react-router-dom";

import { loginBg, logo } from "../../assets";
import Login from "../../features/authentication/Login";

const LoginPage = () => {
  return (
    <div className="h-[calc(100vh-80px)] w-full flex items-center justify-center">
      <div
        className={`hidden bg-cover lg:block lg:w-2/3 h-full`}
        style={{ backgroundImage: `url(${loginBg})` }}
      >
        <div className="flex items-center h-full px-20 bg-gray-900 bg-opacity-40">
          <div>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Digital Information Board
            </h2>

            <p className="max-w-xl mt-3 text-gray-300">
              Transforming the Computer Engineering Department’s digital board
              into a dynamic, interactive hub for announcements, schedules, and
              updates — making information sharing smarter and faster.
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
        <div className="flex-1">
          <div className="text-center">
            <div className="flex justify-center mx-auto">
              <img className="w-auto h-14 sm:h-16" src={logo} alt="Logo" />
            </div>

            <p className="mt-3 text-xl text-center text-gray-600 dark:text-gray-200">
              Welcome Back!
            </p>
          </div>

          <div className="mt-8">
            <Login />

            <p className="mt-6 text-sm text-center text-gray-400">
              Don&#x27;t have an account yet?{" "}
              <Link
                to="/signup"
                className="text-blue-500 focus:outline-none focus:underline hover:underline"
              >
                Sign up
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
