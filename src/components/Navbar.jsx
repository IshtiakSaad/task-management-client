import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between items-center">
      <h1 className="text-xl font-bold">Task Manager</h1>
      {user ? (
        <div className="flex items-center gap-4">
          <span>{user.displayName}</span>
          <button onClick={logout} className="bg-red-500 px-3 py-1 rounded-md">
            Logout
          </button>
        </div>
      ) : (
        <button onClick={login} className="bg-green-500 px-3 py-1 rounded-md">
          Sign in with Google
        </button>
      )}
    </nav>
  );
};

export default Navbar;
