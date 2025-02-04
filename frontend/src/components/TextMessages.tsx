import { Typography, Box, Avatar, Button, Badge } from "@mui/material";
import { Message, User } from "../utils/interface";
import { useAppSelector } from "../hooks/apppandDispatch";
import { useEffect, useRef, useState, useLayoutEffect } from "react";
import { useDispatch } from "react-redux";
import {
  setAllRecipientsLastMsg,
  setUserMessages,
} from "../Redux/Slices/user-slice";
import { formatDate } from "../App";
import { BsFillSendCheckFill } from "react-icons/bs";

import { IoIosArrowBack } from "react-icons/io";

interface TextMessagesProps {
  recieverId: string | null;
  recipient: User | null;
  setIsSeen: (value: boolean) => void;
  setSideBarScreen: (value: boolean) => void;
  setMsgScreen: (value: boolean) => void;
  setRecieverId: (value: string | null) => void;
}
const TextMessages: React.FC<TextMessagesProps> = ({
  recieverId,
  recipient,
  setIsSeen,

  setSideBarScreen,
  setMsgScreen,
  setRecieverId,
}) => {
  const dispatch = useDispatch();
  const { messages, isMessages } = useAppSelector((state) => state.user) || [];

  const { user } = useAppSelector((state) => state.user);
  const { socket } = useAppSelector((state) => state.socket);
  const [msg, setMsg] = useState("");
  const fromMe = user?.id;
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSendingMessage() {
    if (socket) {
      try {
        socket.emit(
          "send-message",
          recieverId,
          msg,
          user?.id,
          (response: Message) => {
            if (response) {
              console.log("respponse", response);
              dispatch(setUserMessages([...(messages || []), response]));
              dispatch(setAllRecipientsLastMsg(response));
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
      dispatch(setAllRecipientsLastMsg(data));
      console.log("recieverId", recieverId);
      console.log("recepient", recipient?.id);
      if (data?.senderId === recieverId) {
        setIsSeen(true);
      } else {
        setIsSeen(false);
      }

      dispatch(setUserMessages([...(messages || []), data]));
      lastMessageRef.current?.scrollIntoView();
    });
  }, [socket, messages]);

  if (!isMessages) {
    return (
      <Box
        flexGrow="1"
        overflow="auto"
        display="flex"
        mt="-50px"
        flexDirection="column"
        justifyContent={"center"}
        alignItems={"center"}
        sx={{
          backgroundImage: `url(
          data:image/png;base64,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
        )`,
        }}
      >
        <img
          className="w-20"
          src="data:image/png;base64,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"
        />
        <Typography fontSize={"28px"} fontWeight={"bold"}>
          Start your conversation
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          width: "100%",
          p: 2,
          backgroundColor: "#3333",
        }}
      >
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Button
            onClick={() => {
              setRecieverId(null);
              setIsSeen(true);

              setSideBarScreen(true);
              setMsgScreen(false);
            }}
            sx={{
              color: "blue",
              fontSize: "30px",

              display: {
                xs: "block",
                sm: "none",
                mr: -3,
                pl: 0,
              },
            }}
          >
            <IoIosArrowBack style={{ padding: 0, marginLeft: "-20px" }} />
          </Button>
          <Badge
            overlap="circular"
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            variant="dot"
            color="success"
            invisible={!recipient?.online}
          >
            <Avatar
              alt={recipient?.profilePic}
              src={recipient?.profilePic}
              sx={{
                ml: { xs: -6, sm: 0 },
                width: 48,
                height: 48,
                borderColor: "white",
              }}
            />
          </Badge>

          <Typography
            sx={{
              fontWeight: "bold",
              m: 0,
              p: 0,
              color: "blue",
              fontSize: "20px",
            }}
          >
            {recipient?.fullname}
          </Typography>
        </Box>
      </Box>

      <Box
        flexGrow="1"
        display="flex"
        flexDirection="column"
        overflow="auto"
        gap="14px"
        sx={{
          padding: {
            xs: "20px",
            sm: "40px",
            backgroundImage: `url(
                https://plus.unsplash.com/premium_photo-1668116307088-583ee0d4aaf7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8d2hhdHNhcHAlMjB3YWxscGFwZXJ8ZW58MHx8MHx8fDA%3D
                )`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          },
        }}
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
                    minWidth: "120px",
                    minHeight: "40px",
                    px: 1,
                    py: 0.5,
                    borderRadius: "10px",

                    justifyContent: "space-between",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#eeeeee",
                      fontSize: { xs: "13px", md: "14px" },
                    }}
                  >
                    {msg.body}
                  </Typography>
                  <Typography
                    sx={{
                      justifySelf: "flex-end",
                      fontSize: {
                        xs: "11px",
                      },
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

      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 3,
          p: 2,
          pl: { xs: 2, md: 4 },
          pr: { xs: 2, md: 4 },
          backgroundColor: "#fff",
          borderTop: "1px solid grey",
        }}
      >
        <textarea
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && msg.trim() !== "") {
              e.preventDefault();
              handleSendingMessage();
            }
          }}
          rows={1}
          className="flex-1 p-2 text-lg resize-none outline-none"
          placeholder="Type a message..."
        />

        <Box
          sx={{
            fontSize: { xs: "19px", sm: "25px" },
            display: "flex",
            alignItems: "center",
          }}
          onClick={handleSendingMessage}
        >
          <BsFillSendCheckFill />
        </Box>
      </Box>
    </>
  );
};

export default TextMessages;
