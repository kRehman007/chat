import toast from "react-hot-toast";
import AxiosInstance from "../utils/AxiosInstance";
import { signupCredentials } from "../utils/interface";

interface LoginResponse {
  user: signupCredentials;
  token?: string;
  error?: string;
}

export const useLogin = async (userData: signupCredentials): Promise<any> => {
  try {
    toast.loading("logging in...");
    const response = await AxiosInstance.post<LoginResponse>(
      "/user/login",
      userData
    );
    if (response?.data?.token) {
      localStorage.setItem("token", response.data.token);
    }
    toast.dismiss();
    return response;
  } catch (error: any) {
    toast.dismiss();
    throw error;
  }
};
