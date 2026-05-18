import { createBrowserRouter } from "react-router-dom";
import Register from "./features/pages/register";
import Login from "./features/pages/login";
import Home from "./features/pages/home";
import ReportPage from "./features/pages/report";
import Protected from "./components/protected";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/report",
    element: (
      <Protected>
        <ReportPage />
      </Protected>
    ),
  },
  {
    path: "/report/:interviewId",
    element: (
      <Protected>
        <ReportPage />
      </Protected>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);
