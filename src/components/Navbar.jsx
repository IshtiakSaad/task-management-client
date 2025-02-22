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
    <nav className="w-full px-6 py-4 border-b bg-gray-900/80 backdrop-blur-md shadow-lg flex justify-between items-center">
      <h1 className="text-2xl font-bold text-white tracking-wide">Task Manager</h1>
      <div className="flex items-center gap-6">
        {user ? (
          <>
            <span className="text-gray-400 text-sm">{user.displayName}</span>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition rounded-lg"
            >
              <LogOut size={16} />
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={login}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition rounded-lg"
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
