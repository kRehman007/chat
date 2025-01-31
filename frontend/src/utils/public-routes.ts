import Login from "../pages/Login";
import Signup from "../pages/Signup";
import { RouteLayOut } from "./interface";
import { URL } from "./URL";

export const PublicRoutes: RouteLayOut[] = [
  {
    link: URL.SIGNUP,
    element: Signup,
    isProtected: false,
  },
  {
    link: URL.LOGIN,
    element: Login,
    isProtected: false,
  },
];
