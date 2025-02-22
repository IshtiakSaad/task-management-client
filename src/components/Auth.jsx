import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Auth = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-6">
      <div className="bg-gray-800 shadow-xl rounded-xl w-full max-w-md p-8 flex flex-col items-center">
        <h2 className="text-5xl font-extrabold text-white mb-8 text-center">
          Task Manager
        </h2>
        <p className="text-lg text-gray-400 mb-6 text-center">
          Organize your tasks effortlessly. Manage your workflow with ease and focus.
        </p>
        <button
          onClick={login}
          className="w-full bg-gradient-to-r from-blue-500 to-teal-400 text-white px-6 py-3 rounded-full font-semibold text-lg hover:scale-105 transition-all duration-300 ease-in-out shadow-md transform"
        >
          Sign in with Google
        </button>
        <div className="mt-6 text-sm text-gray-500">
          <p>By signing in, you agree to our <a href="#" className="text-blue-400">Terms of Service</a> and <a href="#" className="text-blue-400">Privacy Policy</a>.</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
