import { ComponentType } from "react";

export interface RouteLayOut {
  link: string;
  element: ComponentType;
  isProtected: boolean;
}

export interface signupCredentials {
  fullname: string;
  username: string;
  email: string;
  password: string;
  gender: string;
  confirmPassword?: string;
}

export interface User {
  id?: string;
  fullname: string;
  username: string;
  email: string;
  password: string;
  gender: string;
  profilePic?: string;
  createdAt?: Date | string | undefined;
  online?: boolean;
}

export interface Message {
  id: string;
  body: string;
  createdAt?: string;
  recieverId?: string;
  senderId: string;
  seen?: boolean;
}
