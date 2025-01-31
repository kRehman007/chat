import AxiosInstance from "../utils/AxiosInstance";

export function getToken(): string | null {
  const token = localStorage.getItem("token");
  return token;
}

const useGetChatWithUser = (id: string) => {
  try {
    const response = AxiosInstance.get(`/messages/get-chat/${id}`, {});
    return response;
  } catch (error) {
    throw error;
  }
};

export default useGetChatWithUser;
