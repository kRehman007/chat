import jwt from "jsonwebtoken";
import prisma from "../db/prisma.js";
export const AuthUser = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers["authorization"]?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        let decoded = null;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        }
        catch (err) {
            console.log("eror in validating user", err);
            return res.status(401).json({ error: "Unauthorized, Invalid Token" });
        }
        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                fullname: true,
                username: true,
                email: true,
                gender: true,
                profilePic: true,
            },
        });
        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }
        req.user = user;
        next();
    }
    catch (error) {
        console.log("Error in user-auth middleware", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
