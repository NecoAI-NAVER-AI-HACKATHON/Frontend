import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 dark:bg-gray-900 text-center px-6">
      <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
      <h1 className="text-5xl font-bold text-gray-800 dark:text-gray-100 mb-2">
        404
      </h1>
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
        Page Not Found
      </h2>
      <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
        Oops! The page you’re looking for doesn’t exist or has been moved.
      </p>
      <button
        onClick={() => navigate("/")}
        className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition"
      >
        Go Back Home
      </button>
    </div>
  );
};

export default NotFoundPage;
