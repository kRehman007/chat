import toast from "react-hot-toast";
import { signupCredentials } from "../utils/interface";
import AxiosInstance from "../utils/AxiosInstance";

interface SignupResponse {
  user: signupCredentials;
  token: string;
  error?: string;
}

export const useSignup = async (userData: signupCredentials): Promise<any> => {
  try {
    toast.loading("creating account...");
    const response = await AxiosInstance.post<SignupResponse>(
      "/user/signup",
      userData
    );
    if (response?.data?.token) {
      localStorage.setItem("token", response.data.token);
    }
    toast.dismiss();
    return response;
  } catch (error) {
    toast.dismiss();
    throw error;
  }
};
