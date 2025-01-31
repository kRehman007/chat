import AxiosInstance from "../utils/AxiosInstance";
import toast from "react-hot-toast";
const useLogout = async () => {
  try {
    toast.loading("logging out...");
    await AxiosInstance.get("/user/logout");
    toast.dismiss();
  } catch (error: any) {
    throw error;
  }
};

export default useLogout;
