import prisma from "../db/prisma.js";
export const sendMessage = async (req, res) => {
    try {
        const { id: recieverId } = req.params;
        const { message } = req.body;
        if (!recieverId || !message) {
            res.status(401).json({ error: "All fields are required" });
            return;
        }
        const sentMessage = await prisma.message.create({
            data: {
                senderId: String(req.user.id),
                recieverId: String(recieverId),
                body: message,
            },
        });
        res.status(201).json({ message: sentMessage });
        return;
    }
    catch (error) {
        console.log("error in sending-message controller", error.message);
        res.status(500).json({ error: "internal server error" });
        return;
    }
};
export const getChatofTwoUsers = async (req, res) => {
    try {
        const { id: recieverId } = req.params;
        const lastMessage = await prisma.message.findFirst({
            where: {
                OR: [
                    { senderId: String(req?.user.id), recieverId: String(recieverId) },
                    { senderId: String(recieverId), recieverId: String(req?.user.id) },
                ],
            },
            orderBy: { createdAt: "desc" }, // Get the latest message
        });
        if (!lastMessage) {
            res.status(200).json({ messages: [] });
            return;
        }
        const resp = await prisma.message.update({
            where: { id: lastMessage.id },
            data: { seen: true },
        });
        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: String(req.user.id), recieverId: String(recieverId) },
                    { senderId: String(recieverId), recieverId: String(req.user.id) },
                ],
            },
            orderBy: {
                createdAt: "asc",
            },
        });
        res.status(200).json({ messages });
        return;
    }
    catch (error) {
        console.log("error in getting-chat controller", error.message);
        res.status(500).json({ error: "internal server error" });
        return;
    }
};
export const getLastMsg = async (req, res) => {
    try {
        const { id: recieverId } = req.params;
        const lastMessage = await prisma.message.findFirst({
            where: {
                OR: [
                    { senderId: String(req.user.id), recieverId: String(recieverId) },
                    { senderId: String(recieverId), recieverId: String(req.user.id) },
                ],
            },
            orderBy: { createdAt: "desc" }, // Get the latest message
        });
        if (!lastMessage) {
            res.status(404).json({ error: "No messages found" });
            return;
        }
        res.status(200).json({ message: lastMessage });
        return;
    }
    catch (error) {
        console.log("error in getting last message", error.message);
        res.status(500).json({ error: "internal server error" });
        return;
    }
};
