import axios from "axios";
import { getToken } from "../hooks/useGetChatWithUser";

const AxiosInstance = axios.create({
  baseURL: "http://127.0.0.1:5000/api",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  },
  withCredentials: true,
});

export default AxiosInstance;
