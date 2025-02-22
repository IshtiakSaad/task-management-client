import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white text-gray-800">
      <div className="text-center max-w-md w-full">
        <h1 className="text-6xl font-bold text-gray-900">404</h1>
        <p className="text-lg mt-4 mb-6">Oops! The page you are looking for doesn't exist.</p>
        <Link
          to="/"
          className="bg-blue-500 text-white px-6 py-3 rounded-md font-semibold transition-all duration-300 hover:bg-blue-600"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
