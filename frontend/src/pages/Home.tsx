import Box from "@mui/material/Box";
import Sidebar from "../components/Sidebar";
import TextMessages from "../components/TextMessages";
import useGetChatWithUser from "../hooks/useGetChatWithUser";
import { useEffect, useState } from "react";
import { useAppSelector } from "../hooks/apppandDispatch";
import { useDispatch } from "react-redux";
import {
  setAllRecipientsLastMsg,
  setUserMessages,
} from "../Redux/Slices/user-slice";
import { Message, User } from "../utils/interface";

import { Link, useNavigate } from "react-router-dom";
import useLogout from "../hooks/useLogout";
import toast from "react-hot-toast";
import { useGetAllUsersQuery } from "../Redux/RTK/MessageAPI";

export default function Home() {
  const { socket } = useAppSelector((state) => state.socket);
  const { user } = useAppSelector((state) => state.user);
  const [recieverId, setRecieverId] = useState<string | null>(null);
  const [recipient, setRecipient] = useState<User | null>(null);
  const [lastMsg, setLastMsg] = useState<Message | null>(null);
  const { data } = useGetAllUsersQuery();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (socket) {
      socket.emit("join", user?.id);
    }
  }, [user, socket]);

  async function getChatWithUser(recipient: User | null) {
    setRecieverId(String(recipient?.id));
    setRecipient(recipient);

    try {
      console.log("redce", recipient?.id);
      const res = await useGetChatWithUser(String(recipient?.id));
      dispatch(setUserMessages(res.data.messages));
    } catch (error: any) {
      console.log("error", error);
    }
  }

  async function Logout() {
    try {
      await useLogout();
      navigate("/login");
    } catch (error: any) {
      console.log("error in logging out", error.message);
      toast.error(error?.response?.data?.error);
    }
  }
  useEffect(() => {
    const response = data?.map((recipient) => getChatWithUser(recipient));
    // console.log("alusers",response)
    // dispatch(setAllRecipientsLastMsg)
  }, [data]);
  return (
    <Box sx={{ display: "flex", maxWidth: "100vw", height: "100vh" }}>
      <Link to="" onClick={Logout}>
        Logout
      </Link>
      <Sidebar
        getChatWithUser={getChatWithUser}
        lastMsg={lastMsg}
        recieverId={recieverId}
      />

      <Box
        sx={{ display: { xs: "none", md: "flex" } }}
        flexDirection="column"
        width="70%"
        justifyContent="space-between"
        flexGrow="1"
      >
        <TextMessages
          recieverId={recieverId}
          recipient={recipient || null}
          setLastMsg={setLastMsg}
        />
      </Box>
    </Box>
  );
}
