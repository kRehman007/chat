import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Message, User } from "../../utils/interface";

interface initialStateProps {
  user: User | null;
  isAuthenticated: boolean;
  messages: Message[] | null;
  allRecipientMsgs: Message[] | null;
}

const initialState: initialStateProps = {
  user: null,
  isAuthenticated: false,
  messages: null,
  allRecipientMsgs: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      (state.user = action.payload), (state.isAuthenticated = true);
    },
    clearUser: (state) => {
      (state.user = null), (state.isAuthenticated = false);
    },
    setUserMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    setAllRecipientsLastMsg: (state, action: PayloadAction<Message>) => {
      if (state.allRecipientMsgs) {
        state.allRecipientMsgs.push(action.payload);
      } else {
        state.allRecipientMsgs = [action.payload];
      }
    },
  },
});

export const { setUser, clearUser, setUserMessages, setAllRecipientsLastMsg } =
  userSlice.actions;
export default userSlice.reducer;
