import Home from "../pages/Home";
import { RouteLayOut } from "./interface";
import { URL } from "./URL";

export const ProtectedRoutes: RouteLayOut[] = [
  {
    link: URL.HOME,
    element: Home,
    isProtected: true,
  },
];
