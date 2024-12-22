import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="text-center px-6">
        <h1 className="text-7xl font-bold text-indigo-600 animate-bounce">
          404
        </h1>
        <h2 className="mt-4 text-2xl font-semibold text-gray-800">
          Oops! Page Not Found
        </h2>
        <p className="mt-2 text-gray-600">
          Sorry, the page you’re looking for doesn’t exist or has been moved.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block px-6 py-3 text-white bg-indigo-600 rounded-lg shadow hover:bg-indigo-700 transition"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
};
export default NotFoundPage;
