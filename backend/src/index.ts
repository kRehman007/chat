import dotenv from "dotenv";
dotenv.config();
import express, { Application, Request, Response } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoutes from "./routes/user-route.js";
import messageRoutes from "./routes/message-route.js";
import { AuthUser } from "./middlewares/auth-middleware.js";
//For env File

export const app: Application = express();

const __dirname = path.resolve();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
if (process.env.NODE_ENV !== "development") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
  });
}
app.use("/validate-user", AuthUser, (req: Request, res: Response) => {
  res.status(201).json({ user: req.user });
  return;
});
app.use("/api/user", userRoutes);
app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => {
  res.send("pk");
});
