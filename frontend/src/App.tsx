import { Route, Routes } from "react-router-dom";
import useRoutes from "./hooks/useRoutes";
import { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { connectSocket } from "./Redux/Slices/socket-slice";
import UserprotectedRoute from "./components/UserprotectedRoute";

export function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleTimeString(undefined, options);
}

function App() {
  const routes = useRoutes();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(connectSocket());
  }, []);

  return (
    <>
      <Toaster position="bottom-right" />
      <Routes>
        {routes.map(({ link, element: Element, isProtected }, index) =>
          isProtected ? (
            <Route
              path={link}
              element={
                <UserprotectedRoute>
                  <Element />
                </UserprotectedRoute>
              }
              key={index}
            />
          ) : (
            <Route path={link} element={<Element />} key={index} />
          )
        )}
      </Routes>
    </>
  );
}

export default App;
