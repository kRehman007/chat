import { Server } from "socket.io";
import prisma from "./db/prisma.js";
let io;
export function initializeSocket(server) {
    io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"],
        },
    });
    io.on("connection", (socket) => {
        // console.log(`Client connected ${socket.id}`);
        socket.on("join", async (userId) => {
            // console.log(`${userId} connected  room `);
            if (!userId) {
                socket.emit("error-message", "userId is not found");
                return;
            }
            await prisma.user.updateMany({
                where: { id: userId },
                data: {
                    socketId: socket.id,
                },
            });
        });
        socket.on("send-message", async (recieverId, text, userId, callback) => {
            if (!recieverId || !text) {
                socket.emit("error-message", "ReciverId and Message is required");
                return;
            }
            const socketID = await prisma.user.findUnique({
                where: {
                    id: recieverId,
                },
                select: {
                    socketId: true,
                },
            });
            if (socketID?.socketId) {
                const message = await prisma.message.create({
                    data: {
                        senderId: userId,
                        recieverId: recieverId,
                        body: text,
                    },
                });
                callback(message);
                socket.to(socketID?.socketId).emit("recieve-msg", message);
            }
        });
        socket.on("disconnect", async () => {
            // console.log("Client disconnected", socket.id);
        });
    });
}
