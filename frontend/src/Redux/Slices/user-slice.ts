import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Message, User } from "../../utils/interface";

interface initialStateProps {
  user: User | null;
  isAuthenticated: boolean;
  messages: Message[] | null;
  isMessages: boolean;
  allRecipientMsgs: Message[] | null;
}

const initialState: initialStateProps = {
  user: null,
  isAuthenticated: false,
  messages: null,
  allRecipientMsgs: null,
  isMessages: false,
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
      state.isMessages = true;
    },
    setAllRecipientsLastMsg: (state, action: PayloadAction<Message>) => {
      if (!state.allRecipientMsgs) {
        state.allRecipientMsgs = [action.payload];
        return;
      }

      // Find index of the existing message by sender and receiver IDs
      const index = state.allRecipientMsgs.findIndex(
        (msg) =>
          (msg.senderId === action.payload.senderId &&
            msg.recieverId === action.payload.recieverId) ||
          (msg.senderId === action.payload.recieverId &&
            msg.recieverId === action.payload.senderId) // Ensure it works both ways
      );

      if (index !== -1) {
        // Replace the existing message
        state.allRecipientMsgs[index] = action.payload;
      } else {
        // Add new message if not found
        state.allRecipientMsgs.push(action.payload);
      }
    },
  },
});

export const { setUser, clearUser, setUserMessages, setAllRecipientsLastMsg } =
  userSlice.actions;
export default userSlice.reducer;
