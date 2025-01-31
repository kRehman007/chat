import React, { useEffect } from "react";

import { useNavigate } from "react-router-dom";

import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../Redux/Slices/user-slice";
import toast from "react-hot-toast";

function getToken(): string | null {
  const token = localStorage.getItem("token");
  return token;
}

const UserprotectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuthUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/validate-user", {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });
        dispatch(setUser(res.data.user));
        console.log("respone", res.data.user);
      } catch (error: any) {
        console.log("Error in protected rout", error.message);
        navigate("/login");
        toast.error("you need to login first");
      }
    };
    fetchAuthUser();
  }, [dispatch]);

  return <div>{children}</div>;
};

export default UserprotectedRoute;
