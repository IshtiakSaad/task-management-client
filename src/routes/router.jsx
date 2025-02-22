import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Auth from "../components/Auth";
import MainLayout from "../pages/MainLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <h2>Error 404!</h2>,
    children: [
      {
        path: "/",
        element: <Auth />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
    ],
  },
]);

export default router;
