import { ProtectedRoutes } from "../utils/protected-routes";
import { PublicRoutes } from "../utils/public-routes";

const useRoutes = () => {
  return [...ProtectedRoutes, ...PublicRoutes];
};

export default useRoutes;
