import { Typography, Box, Avatar } from "@mui/material";
import { Message, User } from "../utils/interface";
import { useAppSelector } from "../hooks/apppandDispatch";
import { useEffect, useRef, useState, useLayoutEffect } from "react";
import AxiosInstance from "../utils/AxiosInstance";
import { useDispatch } from "react-redux";
import { setUserMessages } from "../Redux/Slices/user-slice";
import { formatDate } from "../App";
import { BsFillSendCheckFill } from "react-icons/bs";
import { SiImessage } from "react-icons/si";

interface TextMessagesProps {
  recieverId: string | null;
  recipient: User | null;
  setLastMsg: (msg: Message | null) => void;
}
const TextMessages: React.FC<TextMessagesProps> = ({
  recieverId,
  recipient,
  setLastMsg,
}) => {
  const dispatch = useDispatch();
  const messages = useAppSelector((state) => state.user.messages) || [];

  const { user } = useAppSelector((state) => state.user);
  const { socket } = useAppSelector((state) => state.socket);
  const [msg, setMsg] = useState("");
  const fromMe = user?.id;
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  console.log("logedin", user?.id);
  useLayoutEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSendingMessage() {
    if (socket) {
      try {
        // const response = await AxiosInstance.post(
        //   `/messages/send/${recieverId}`,
        //   { message: msg }
        // );

        // dispatch(setUserMessages([...messages, response.data.message]));
        socket.emit(
          "send-message",
          recieverId,
          msg,
          user?.id,
          (response: Message) => {
            if (response) {
              console.log("respponse", response);
              dispatch(setUserMessages([...messages, response]));
              setLastMsg(response);
            }
          }
        );

        setMsg("");
      } catch (error: any) {
        console.log("error in sending message", error);
      }
    }
  }
  useEffect(() => {
    socket?.on("recieve-msg", (data: Message) => {
      console.log("rmsg", data);
      setLastMsg(data);
      dispatch(setUserMessages([...messages, data]));
      lastMessageRef.current?.scrollIntoView();
    });
  }, [socket, messages]);

  return (
    <>
      <Box sx={{ width: "100%", p: 2, backgroundColor: "black" }}>
        <Box sx={{ display: "flex", gap: 2.5, alignItems: "center" }}>
          <Avatar
            alt={recipient?.profilePic}
            src={recipient?.profilePic}
            sx={{ ml: 0, width: 48, height: 48 }}
          />

          <Typography
            sx={{
              fontWeight: "bold",
              m: 0,
              p: 0,
              color: "#fff",
              fontSize: "20px",
            }}
          >
            {recipient?.fullname}
          </Typography>
        </Box>
      </Box>
      {messages.length === 0 ? (
        <Box
          flexGrow="1"
          overflow="auto"
          display="flex"
          flexDirection="column"
          justifyContent={"center"}
          alignItems={"center"}
        >
          <SiImessage fontSize={"40px"} color="green" />
          <Typography fontSize={"28px"} fontWeight={"bold"}>
            Start your conversation
          </Typography>
        </Box>
      ) : (
        <Box
          flexGrow="1"
          display="flex"
          flexDirection="column"
          overflow="auto"
          gap="14px"
          padding="40px"
        >
          {messages?.map(
            (msg, index) =>
              (msg?.senderId === recieverId ||
                msg?.recieverId === recieverId) && (
                <Box
                  key={index}
                  display="flex"
                  gap="10px"
                  justifyContent={
                    msg.senderId === fromMe ? "flex-end" : "flex-start"
                  }
                  alignItems="start"
                  ref={index === messages.length - 1 ? lastMessageRef : null}
                >
                  <Avatar
                    alt="Travis Howard"
                    src={
                      msg.senderId === fromMe
                        ? user?.profilePic
                        : recipient?.profilePic
                    }
                    sx={{ ml: -0.5, width: "30px", height: "30px" }}
                  />
                  <Box
                    sx={{
                      backgroundColor: "#4CAF50",
                      minWidth: "100px",
                      minHeight: "40px",
                      px: 1,

                      pt: 0.5,
                      borderRadius: "10px",
                      display: "flex",
                      gap: 2,

                      justifyContent: "space-between",
                    }}
                  >
                    <Typography sx={{ color: "#eeeeee" }}>
                      {msg.body}
                    </Typography>
                    <Typography
                      sx={{
                        alignSelf: "flex-end",
                        fontSize: "13px",
                        color: "#333",
                      }}
                    >
                      {formatDate(String(msg.createdAt))}
                    </Typography>
                  </Box>
                </Box>
              )
          )}
        </Box>
      )}

      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          pl: 4,
          pr: 6,
          backgroundColor: "#fff",
          borderTop: "1px solid grey",
        }}
      >
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && msg.trim() !== "") {
              handleSendingMessage();
            }
          }}
          type="text"
          autoFocus
          className="flex-1 border-none outline-none  p-2 text-lg"
          placeholder="Type a message... "
        />

        <BsFillSendCheckFill fontSize={"25px"} onClick={handleSendingMessage} />
      </Box>
    </>
  );
};

export default TextMessages;
