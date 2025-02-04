import Box from "@mui/material/Box";
import Sidebar from "../components/Sidebar";
import TextMessages from "../components/TextMessages";
import useGetChatWithUser from "../hooks/useGetChatWithUser";
import { useEffect, useState } from "react";
import { useAppSelector } from "../hooks/apppandDispatch";
import { useDispatch } from "react-redux";
import { setUserMessages } from "../Redux/Slices/user-slice";
import { User } from "../utils/interface";

export default function Home() {
  const { socket } = useAppSelector((state) => state.socket);
  const { user } = useAppSelector((state) => state.user);
  const [recieverId, setRecieverId] = useState<string | null>(null);
  const [recipient, setRecipient] = useState<User | null>(null);
  const [Isseen, setIsSeen] = useState(false);

  const [SideBarScreen, setSideBarScreen] = useState(true);
  const [MsgScreen, setMsgScreen] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    if (window.innerWidth <= 700) {
      setSideBarScreen(true);
      setMsgScreen(false);
    }
  }, [window.innerWidth]);

  useEffect(() => {
    if (socket) {
      socket.emit("join", user?.id);
    }
  }, [user, socket]);

  async function getChatWithUser(recipient: User | null) {
    if (window.innerWidth <= 700) {
      setSideBarScreen(false);
      setMsgScreen(true);
    }
    setIsSeen(true);
    setRecieverId(String(recipient?.id));
    setRecipient(recipient);

    try {
      const res = await useGetChatWithUser(String(recipient?.id));
      dispatch(setUserMessages(res.data.messages));
    } catch (error: any) {
      console.log("error", error);
    }
  }

  return (
    <Box sx={{ display: "flex", maxWidth: "100vw", height: "100vh" }}>
      {SideBarScreen && (
        <Sidebar
          getChatWithUser={getChatWithUser}
          Isseen={Isseen}
          setIsSeen={setIsSeen}
        />
      )}

      <Box
        sx={{ display: MsgScreen ? "flex" : "none" }}
        flexDirection="column"
        width="70%"
        justifyContent="space-between"
        flexGrow="1"
      >
        <TextMessages
          recieverId={recieverId}
          setRecieverId={setRecieverId}
          recipient={recipient || null}
          setIsSeen={setIsSeen}
          setSideBarScreen={setSideBarScreen}
          setMsgScreen={setMsgScreen}
        />
      </Box>
    </Box>
  );
}
