import express from "express";
import {
  userLogin,
  userLogout,
  userSignup,
  getAllUsers,
} from "../controllers/user-controller.js";
const router = express.Router();
import { AuthUser } from "../middlewares/auth-middleware.js";

router.post("/signup", userSignup);

router.post("/login", userLogin);

router.get("/logout", AuthUser, userLogout);

router.get("/all-users", AuthUser, getAllUsers);

export default router;
