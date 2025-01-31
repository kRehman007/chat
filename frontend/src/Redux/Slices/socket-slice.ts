import { createSlice } from "@reduxjs/toolkit";
import { io, Socket } from "socket.io-client";

interface initialStateProps {
  socket: Socket | any;
}

const initialState: initialStateProps = {
  socket: null,
};
export const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    connectSocket: (state) => {
      if (!state.socket) {
        const socket = io(import.meta.env.VITE_BACKEND_URL);

        socket.on("connect", () => {
          console.log("Connected to Server");
        });
        socket.on("disconnect", () => {
          console.log("Disconneted from server");
        });
        state.socket = socket;
      }
    },
  },
});

export const { connectSocket } = socketSlice.actions;
export default socketSlice.reducer;
