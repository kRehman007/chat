import AxiosInstance from "../utils/AxiosInstance";

const usegetLastMsgwithUsers = async (id: any) => {
  try {
    console.log("runniing");
    const response = await AxiosInstance.post(`/messages/users/last-msg/${id}`);
    console.log("response", response);
    return response;
  } catch (error: any) {
    console.log("error in finding last-msg", error);
    throw error;
  }
};

export default usegetLastMsgwithUsers;
