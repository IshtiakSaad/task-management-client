import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Auth from "../components/Auth";
import MainLayout from "../pages/MainLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import ErrorPage from "../pages/ErrorPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Auth />,
      },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;
