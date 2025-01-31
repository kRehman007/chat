import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Message, User } from "../../utils/interface";

function getToken(): string | null {
  const token = localStorage.getItem("token");
  return token;
}

export const messageApi = createApi({
  reducerPath: "messageApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/user",
    credentials: "include",
    prepareHeaders: (headers) => {
      headers.set("Authorization", `Bearer ${getToken()}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getAllUsers: builder.query<User[], void>({
      query: () => "/all-users",
    }),
    getAllusersLastmsg: builder.query<Message, string>({
      query: (id) => `users/last-msg/${id}`,
    }),
  }),
});

export const { useGetAllUsersQuery, useGetAllusersLastmsgQuery } = messageApi;
