import dotenv from "dotenv";
dotenv.config();
import express, { Application, Request, Response } from "express";
import http from "http";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoutes from "./routes/user-route.js";
import messageRoutes from "./routes/message-route.js";
import { AuthUser } from "./middlewares/auth-middleware.js";
//For env File

export const app: Application = express();


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/validate-user", AuthUser, (req: Request, res: Response) => {
  res.status(201).json({ user: req.user });
  return;
});
app.use("/api/user", userRoutes);
app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => {
  res.send("pk");
});
