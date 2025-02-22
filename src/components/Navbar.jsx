import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut, LogIn } from "lucide-react";

const Navbar = () => {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user === null) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <nav className="w-full px-4 sm:px-6 py-3 sm:py-4 border-b bg-gray-900/80 backdrop-blur-md shadow-lg flex flex-wrap justify-between md:justify-around items-center">
      <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide">Task Manager</h1>
      
      <div className="flex items-center gap-4 sm:gap-6">
        {user ? (
          <>
            <span className="text-gray-400 text-xs sm:text-sm">{user.displayName}</span>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm text-gray-300 hover:bg-gray-700 transition rounded-lg"
            >
              <LogOut size={16} />
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={login}
            className="flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm text-gray-300 hover:bg-gray-700 transition rounded-lg"
          >
            <LogIn size={16} />
            Sign in with Google
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
