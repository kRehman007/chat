import { Request, Response } from "express";
import prisma from "../db/prisma.js";
import bcryptjs from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

export const userSignup = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { fullname, username, password, gender, email } = req.body;
  if (!fullname || !username || !password || !gender) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }
  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    res.status(400).json({ error: "email already exists" });
    return;
  }
  try {
    const salt = await bcryptjs.genSalt(12);
    const hashedPassword = await bcryptjs.hash(password, salt);
    const MenProfile = `https://avatar.iran.liara.run/public/boy?username=${fullname}`;
    const GirlProfile = `https://avatar.iran.liara.run/public/boy?username=${fullname}`;
    const createdUser = await prisma.user.create({
      data: {
        fullname,
        username,
        email,
        password: hashedPassword,
        gender,
        profilePic: gender === "male" ? MenProfile : GirlProfile,
      },
    });

    const token = generateToken(createdUser.id, res);

    res.status(200).json({
      user: {
        id: createdUser.id,
        fullname: createdUser.fullname,
        username: createdUser.username,
        email: createdUser.email,
        gender: createdUser.gender,
        profilePic: createdUser.profilePic,
      },
      token,
    });
    return;
  } catch (error: any) {
    console.log("error in user signup controller", error.message);
    res.status(500).json({ error: "internal server error" });
    return;
  }
};

export const userLogin = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(400).json({ error: "Email or password is incorrect" });
      return;
    }
    const IsPasswordCorrect = await bcryptjs.compare(password, user.password);
    if (!IsPasswordCorrect) {
      res.status(400).json({ error: "Email or password is incorrect" });
      return;
    }
    const token = generateToken(user.id, res);
    res.status(200).json({
      user: {
        id: user.id,
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        gender: user.gender,
        profilePic: user.profilePic,
        token,
      },
      token,
    });
    return;
  } catch (error: any) {
    console.log("error in user login controller", error.message);
    res.status(500).json({ error: "internal server error" });
    return;
  }
};
export const userLogout = (req: Request, res: Response) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "user logout successfully" });
  } catch (error: any) {
    console.log("error in user logout controller", error.message);
    res.status(500).json({ error: "internal server error" });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        id: {
          not: req.user.id,
        },
      },
      select: {
        id: true,
        fullname: true,
        username: true,
        email: true,
        gender: true,
        profilePic: true,
      },
    });
    res.status(201).json(users);
    return;
  } catch (error: any) {
    console.log("error in get-all-user controller", error.message);
    res.status(500).json({ error: "internal server error" });
  }
};
