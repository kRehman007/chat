import { Stack, Typography, Box, Skeleton, Badge } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Avatar from "@mui/material/Avatar";
import { useGetAllUsersQuery } from "../Redux/RTK/MessageAPI";
import { User } from "../utils/interface";
import { useEffect, useRef } from "react";
import { useAppSelector } from "../hooks/apppandDispatch";
import { formatDate } from "../App";
import usegetLastMsgwithUsers from "../hooks/usegetLastMsgwithUsers";
import { clearUser, setAllRecipientsLastMsg } from "../Redux/Slices/user-slice";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import useLogout from "../hooks/useLogout";
import toast from "react-hot-toast";
import { IoMdLogOut } from "react-icons/io";

interface SidebarProps {
  getChatWithUser: (user: User) => void;
  Isseen: boolean;
  setIsSeen: (value: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  getChatWithUser,
  Isseen,
  setIsSeen,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const box = useRef<HTMLLIElement>(null);
  const typo = useRef<HTMLLIElement>(null);
  const { data, isLoading } = useGetAllUsersQuery();
  const allRecipientMsgs = useAppSelector(
    (state) => state.user.allRecipientMsgs
  );

  useEffect(() => {
    async function fetchMessages() {
      if (data && data.length > 0) {
        const messages = await Promise.all(
          data.map(async (user) => {
            try {
              const res = await usegetLastMsgwithUsers(user?.id);

              // If res is undefined or null, return a default structure
              return res?.data?.message || null;
            } catch (error) {
              console.error("Error fetching last message:", error);
              return null; // Prevent breaking Promise.all when an error occurs
            }
          })
        );

        messages.forEach((msg) => {
          if (msg) {
            dispatch(setAllRecipientsLastMsg(msg));
          }
        });
      }
    }

    fetchMessages();
  }, [data, dispatch]);

  function setBackground(user: User) {
    if (allRecipientMsgs && allRecipientMsgs.length > 0) {
      const unreadMsg = allRecipientMsgs.find(
        (rec) => !rec?.seen && rec?.senderId === user?.id
      );
      setIsSeen(false);
      return unreadMsg ? "#4CAF50" : "#3333";
    }
    return "#3333"; // Default color if no messages exist
  }

  async function Logout() {
    try {
      await useLogout();
      dispatch(clearUser());
      navigate("/login");
    } catch (error: any) {
      console.log("error in logging out", error.message);
      toast.error(error?.response?.data?.error);
    }
  }

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
              backgroundColor: {
                xs: setBackground(user),
                sm: !Isseen ? setBackground(user) : "#3333",
              },
              borderRadius: "10px",
              p: 1,
            }}
          >
            <ListItemButton
              sx={{
                display: "flex",
                gap: { xs: 2, sm: 3 },
                alignItems: "center",
              }}
            >
              <Badge
                overlap="circular"
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                variant="dot"
                color="success"
                invisible={!user.online}
              >
                <Avatar
                  alt={user?.profilePic}
                  src={user?.profilePic}
                  sx={{ ml: 0, width: 56, height: 56, borderColor: "white" }}
                />
              </Badge>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: 1,
                  gap: 0.5,
                  alignItems: "start",
                }}
              >
                <Typography
                  ref={typo}
                  sx={{
                    fontWeight: "medium",
                    mt: 0,
                    p: 0,
                    fontSize: { xs: "15px", sm: "23px" },
                    color: "blue",
                  }}
                >
                  {user.fullname}
                </Typography>

                {allRecipientMsgs?.map((recepient) => (
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems={"center"}
                    sx={{ width: "100%", mt: -0.5 }}
                  >
                    <Typography
                      sx={{
                        fontSize: { xs: "13px", sm: "15px" },
                        color: "#333",
                      }}
                    >
                      {recepient?.senderId === user?.id ||
                      recepient?.recieverId === user?.id
                        ? recepient?.body && recepient.body.length > 20
                          ? recepient.body.slice(0, 25) + "..."
                          : recepient?.body
                        : ""}
                    </Typography>
                    <Typography
                      sx={{ fontSize: "12px", mb: { xs: -4, sm: 0 } }}
                    >
                      {recepient?.senderId === user?.id ||
                      recepient?.recieverId === user?.id
                        ? formatDate(String(recepient?.createdAt))
                        : ""}
                    </Typography>
                  </Box>
                ))}
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
        borderRight: { xs: "none", md: "1px solid #3333" },
        width: { xs: "100%", md: "30%" },
        backgroundImage: `url(https://wallpapers.com/images/high/whatsapp-chat-pink-flowers-dreamy-fxr3cfogmqvjaicc.webp)`,
      }}
    >
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        sx={{ width: "100%", color: "blue", p: { xs: 2, sm: 2 }, pt: 2 }}
      >
        <img
          className="w-10"
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJsAAACUCAMAAACz6atrAAAAYFBMVEUcmPf///8Ak/cAkfYAj/YAjfYSlvf6/f8AlPbv9/7P5f1UrPjY6v3s9f55uvnb7P3l8v6dzPqVyPrA3vyv1fs1oPe72/yl0PtJpfdzt/mIwvpPqfjG4fwtm/d+vvlir/iuitdLAAALS0lEQVR4nO2c6RKbKhSADSCgZlGjcUnU93/L68aisqlJ2x/3zLTTSTX5PMDZOOhd/l3x/jaAQf5nOyZfYCO3+Pos0ntVVV3/554Wz2t8I3+d7fFM2iiHPoIQAEAp7f+GEPkwj9rk+fhbbOT2vJce7nk8lfSfY6+8P08o8ChbWHQQAQ8ruZhgDyDYFeGfZAuStwfU6lIoEHjvJPgzbMGnQxCbFbZSH4ao++zH28tGshK7amyhPVxme2fePrY4oegA2CSIJrffsRU5OEw2CMiL37CRVwNPkQ0Cm5f7yDqzPSqwZ/7rBIPK2SI7spEEHVkBKqEocVSdG9v1fW6iLQW8r19jI4X3LaVNQr3CRXUObEF1fg2sBVYOptjOdj1pONRCc/u4Wtmezo5zJxx4nmVLvmE41IKTU2wk9X+G5nl+al4RZrb7L6aaEHA/zEaq447dTVBl0pyJ7cdaG8SoOQPb/ddaGwQZ4PRs6e+1NghI97Nl33cGaoHZXrbPbyyuSuhnH9uj+Z3NXQtuNBGdmo2UeyYb7h1Qn8z30mf3dFcKNgoo1ZZEzVY7o43pe97d0yJ7vbIiabuyweOHe+Bqd7bMEQ2gpquzx+qpSfxKqxzuCeGBcj2o2AKXYcEUgOoVa8IwEodtA921h1Xfo2AjncMaBV5nzZg+rXNmRjvFlynYXvYRhX57dYmqHwl0pAMvFzb7iFKvdi9uJLkTHVaM6pbNukb9blfRKq6hix1XrNUNW2j7jnylfRJfs7or8/7RvaaM2iJ8rFTweDs5mc0Tb9gqo9owqhb1FvKpuwYhAPAwE/q/eiuMvKjNFnh95m1fsaCysX2MgRH25GILCVtPVVLtASleFtw+uV11aO1X12xG9dNGup0UkW+wrxTlieQn49K6JOjbzPYyoQEppyRZrilCc8HUS8UEuHV2uNVMXrIZzS4tYzFGb9/F5iNPGGhiLQ/QVfawZLtCwyDlYojurnVVTDuuuqCzWCcMl7n+ks1wN/a41kI3czoJoNyPk8gCBzo9202vNSycynNnVYnyjCBubFP0pmVL9beKqD51sFVLQbxoFFo2S2iqYwv0KwFE7KLCMCW1d3OzmprzStoFGrZQr7acKTs5lH5BvgIj86jSUMNWa38XMHfwPFiQhsyTf8z3w1rDpp0MtJyvuB4CG8RnS8kc5mBPzfbQzgV/dlVOEbHmR/PZBAXmGYceSjZtkYFG5Mxkm4SvB7Pi5BKEYCOdbkhZFhSfyqeZ8h9GO4KlxEGwPXLd9fm8sOtTdQj8nn6VVMavkTyjYNNWQGDLHvicsDDDXAWSqiOCLdHNA3+2OenJyhILM4jxe0CiYNM64maeAaerN3Beqkb7KzyQxKabouxxr6fLmKhwGADJwvF/3XTVeuYTzq2EQVjQHRqf0r9t2EIdG5vCKxMz5CuLD/oMBpsvwU0wLyrT9PDDDVuhUTRupmvjUv4QlFV9f0u39IlVW1eNNGdp3l8SLemmr7qVJjZYbNha3ZDNzuYqVzLpmKQEBVcALcfdqavICWA93EeyxW2TETfEYsNF7YZN6xXm8CiU/h8yx81mDs2ZNWd7EpCZgqs0gHRSidn6Yh6Yc7a3jq2cJolkmqkI62cUyPf0gulr6Ju7HskJz7aL3I1sPE1lbEGpu3bLJkhmbeK3CFfbkRaI/P8mVghz5Nr5I/+gYIu13nTDhhuRqk23yYnlvKYEflDuZGPRFGd75Lb5Jn0kAmcdGxYpuszmNKbc2zO2q25DgV0qXSDtpHzAdI3I3aZ5LiVMDwGCpxvNIaoYFsYWajc7tvaNh+j96qYr2hjMT8RnYCtsHp5ijJt23U1sbFg4m/ZahV+A7TyGBXMmrFpwK2eVABYjSvsBuJnUGzcGNK4MWW+6S1X+lFbDfA3uHBc341R6lvwiMFZeSS1/1azvqznY2sGmjEOo75WNL9FiiPISyCk/9Wl/iRx4wXkSFuaIRsGmnQMsflv79vV12/r66gP4WExSjWznm3ad9oHBPJf0qbWbAJaumatJ23Vq2JRkufbVUmixss2L+QlBbQh9xZal3S+IPMtoMq2CmS+qKLo9DY+58Qt6f8pDm0u8b+dxJazq8GiGlMBg4jb+lBgu5hthZ2YcZTlKCodnfWnXKuYhjIjfDAOGQvYAx+shbBYRMA4u0T/ENn4zTSZe+Q8PDyrLsXq1TWGntjGG3jdsunxhFL4vnB2oWo5fwH6wX+xoHLNMW0bY5gsfU8eWCDTqQ1kqiNj8roDnj6P70V3rfzZsN+OPQlGxPbAeAA+zM58pRmtQ0TY/XbukNRwPZNvdLXEwYj83AoExkbppDCqmly2bxcthrupsX80XA57UTREUHcdAZ1ClREmwWXqjaMOjxZe3o7MFQ1EYmrJXMxtMFWxPyw9KW219gumoOgxKXusjLGGsTWMqtYjKdUvL70k558Wx7x1A6cRHO9+CMj71FA+jrFvq670CTmxSBnbHj6nXihvInT3NVCh6am5S1nsdmvHkhmFiCA7GH0G4ljZZAr61i/Pxg0L9a+o6uUvxjzYi7zQ4fkwpLguhs/67RWPYZN50eSCStlCd9mUkgS2bQKzOgQEc+qIwwwII5VWx3KXNpObqycXc1E+m25eRM0m9gHcosfUoeV2k1dRYRnGTd/XrujovdpO3jKeVoNtGEbZwxWbYB5RvLwUbxRWfUyQIlC1KQUIlNDiZ1kBjFLT7gOZ8m98ecTb0Xve+beW1aEGkc8BdqNWA3/LG82Lf2Wm/irP5pa6Jk0v8ahb9EGBG022jwEX7+4ItdplwjC1tbaetHmm5bJOCzLDqehaAvLZXfQ7mZqQlm3k0g0dSouUwUHCf79FZ0lVL0pItdBhUGl0sQsKifXvrzjKQ8+BZ543hspVrR1+Nho1kZdQm2fMThuHnVdRdPjRQbeIoyhtlX7q4ft3YuO5Hsg/qiu0ZQTo0ls0ydPhS6HtRjhCgg4Po/3MA5f0libYvcd3XuOnjspqRBVvcrjqmmiYvqyIMSPB41d27LN9dXdRlr8kp9iG1NhvClj4uS//bmm0dZeImVRvgV+ePbKZWM2v/m33GCbZAFWJqLAvJxnmu3TVTtdFu+y1tgzrHOEN8qZqcAKSGk1cGNmzvt7SfRJlWOqk1KQ0GXqc9oqtnU5xOUfT32kIl7BVx/DT0mWGK0Dt9hvEt6OX2kPSoZcOeS3+vLiKVnzHPbc15FAIvL99R9C7zphKtc7YdZAsbsXsu1wQVT6211E8DMxvdNNCq2S7x7g43q8A5FdSYKIxiBcep8ws7BIPhgB2J1E/tfn6BZ7lfhUNdlmmMJw9QHNguxKGNebdoT6qIXWsXNtN2w9dF3o91YesDkj8Fh1XHKoxsp3rddgnUHpHVnwc8u0XkiqY+/2Rm43Wf36K1egADW2DvnD+P1hlO3hjP7f78BCpUGzYHtj7Q/K3moOpUliObtcf6nCD9sVgXtkv9fb8/C0b6FerGdnkdej2NXSjWmVx3tstHmRacFdBYCz1O78Hovu6/MDDZjh1sQ3vtd+EwsL3KwZ3tcs1PbYevxOX9HO5sF5I6HTh0IoOWV0zsZeuzkPLgtu5SMCydT2HueHdTcZ6uJ9vx9qY975W6peCcD4Mg3fPWq33v4wrS/LDuMMzTfe8y28c2vC3M8/ef7u+TaN9LVDnoN9kuQ6Wy2ak8DL3I+uacr7BdyDXNTUdPV2DAz9PwyFsHj7ANcq1LD1j5MABeWbtZ2u+xDZX67F4OBWdl5WZ4/wRC5T07pLGzbAMeiZ91lDcepnB8uyUd33A5vCuhyaP6GZNTb+A8xTYTxuGrSOp2eDFoVd3bOileYfz33wsqC5nke1/4Rbavy/9sx+RfZvsPoW+T7UoxMHwAAAAASUVORK5CYII="
        />

        <Link
          to=""
          onClick={Logout}
          style={{
            fontSize: "25px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#3333",
            borderRadius: "50%",
            width: "38px",
            height: "38px",
          }}
        >
          <IoMdLogOut />
        </Link>
      </Box>

      {data?.length === 0 && (
        <Typography sx={{ p: 2, fontSize: "20px" }}>
          No user to chat with
        </Typography>
      )}
      <Box sx={{ p: 1 }}>
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
