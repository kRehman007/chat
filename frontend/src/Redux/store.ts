import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./Slices/user-slice";
import { messageApi } from "./RTK/MessageAPI";
import { socketSlice } from "./Slices/socket-slice";

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    socket: socketSlice.reducer,
    [messageApi.reducerPath]: messageApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(messageApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
