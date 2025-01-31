import { Stack, Typography, Box, Skeleton } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Avatar from "@mui/material/Avatar";
import { useGetAllUsersQuery } from "../Redux/RTK/MessageAPI";
import { Message, User } from "../utils/interface";
import { useEffect, useRef } from "react";
import { useAppSelector } from "../hooks/apppandDispatch";
import { formatDate } from "../App";

interface SidebarProps {
  getChatWithUser: (user: User) => void;
  lastMsg: Message | null;
  recieverId: string | null;
}

const Sidebar: React.FC<SidebarProps> = ({
  getChatWithUser,
  lastMsg,
  recieverId,
}) => {
  const box = useRef<HTMLLIElement>(null);
  const typo = useRef<HTMLLIElement>(null);
  const { data, isLoading } = useGetAllUsersQuery();
  const messages = useAppSelector((state) => state.user.messages) || [];
  const { user: LoginUser } = useAppSelector((state) => state.user);

  // function getBackgroundColor(user: User) {
  //   if (!lastMsg?.seen && lastMsg?.senderId === user?.id) {
  //     if (box.current) {
  //       return (box.current.style.backgroundColor = "green");
  //     }
  //   }
  //   if (box.current && lastMsg?.senderId === user?.id) {
  //     box.current.style.backgroundColor = "#3333";
  //     if (typo.current) {
  //       typo.current.style.color = "#000";
  //     }
  //   }
  // }

  // useEffect(() => {
  //   if (messages && data) {
  //     const msg = messages[messages.length - 1];
  //     const found = data.some(
  //       (user) =>
  //         msg?.seen &&
  //         msg.senderId === user.id &&
  //         msg.senderId !== LoginUser?.id
  //     );
  //     if (found && box.current) {
  //       box.current.style.backgroundColor = "#3333";
  //     }
  //   }
  // }, [messages, data]);

  const drawer = (
    <div>
      <List>
        {data?.map((user, index) => (
          <ListItem
            ref={box}
            component="li"
            onClick={() => getChatWithUser(user)}
            key={index}
            disablePadding
            sx={{
              borderBottom: ".5px solid #3333",
              my: 1,
              backgroundColor: recieverId === user?.id ? "#4CAF50" : "#3333",
              borderRadius: "10px",
              p: 1,
            }}
            //#002FEB
            //recieverId === user?.id ? "#002FEB" : ""
          >
            <ListItemButton
              sx={{ display: "flex", gap: 3, alignItems: "center" }}
            >
              <Avatar
                alt={user?.profilePic}
                src={user?.profilePic}
                sx={{ ml: 0, width: 56, height: 56 }}
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: 1,
                  gap: 0.5,
                  alignItems: "start",
                }}
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems={"center"}
                  sx={{ width: "100%" }}
                >
                  <Typography
                    ref={typo}
                    sx={{
                      fontWeight: "medium",
                      mt: 0,
                      p: 0,
                      fontSize: "23px",
                      color: recieverId === user?.id ? "blue" : "blue",
                    }}
                  >
                    {user.fullname}
                  </Typography>
                  <Typography sx={{ fontSize: "13px", mt: 1 }}>
                    {lastMsg?.senderId === user?.id ||
                    lastMsg?.recieverId === user?.id
                      ? formatDate(String(lastMsg?.createdAt))
                      : ""}
                  </Typography>
                </Box>

                <Typography sx={{ fontSize: "14px", color: "#333", mt: -1 }}>
                  {lastMsg?.senderId === user?.id ||
                  lastMsg?.recieverId === user?.id
                    ? lastMsg?.body && lastMsg.body.length > 20
                      ? lastMsg.body.slice(0, 35) + "..."
                      : lastMsg?.body
                    : ""}
                </Typography>
              </Box>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Stack
      direction={"column"}
      height="100%"
      overflow="auto"
      sx={{
        borderRight: { xs: "none", md: "1px solid grey" },
        width: { xs: "100%", md: "30%" },
      }}
    >
      <Typography
        component="h2"
        sx={{
          fontSize: "28px",
          fontWeight: "bold",
          width: "100%",
          color: "blue",
          pt: 2,
          pl: 6,
        }}
      >
        Chats
      </Typography>

      {data?.length === 0 && (
        <Typography sx={{ p: 2, fontSize: "20px" }}>
          No user to chat with
        </Typography>
      )}
      <Box sx={{ p: 2 }}>
        {isLoading ? (
          <List>
            {[1, 2, 3].map((_, index) => (
              <ListItem key={index}>
                <ListItemButton
                  sx={{ display: "flex", gap: 1.5, alignItems: "center" }}
                >
                  <Skeleton variant="circular" width={50} height={50} />
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
                  >
                    <Skeleton width={100} height={20} />
                    <Skeleton width={150} height={15} />
                  </Box>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        ) : (
          drawer
        )}
      </Box>
    </Stack>
  );
};

export default Sidebar;
