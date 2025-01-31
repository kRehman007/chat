import express from "express";
import {
  sendMessage,
  getChatofTwoUsers,
  getLastMsg,
} from "../controllers/message-controller.js";
import { AuthUser } from "../middlewares/auth-middleware.js";
const router = express.Router();

router.post("/send/:id", AuthUser, sendMessage);
router.post("/users/last-msg/:id", AuthUser, getLastMsg);
router.get("/get-chat/:id", AuthUser, getChatofTwoUsers);

export default router;
