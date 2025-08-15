import type { Request, Response } from "express";
import { MessageServices } from "./messageService";
import { getIO } from "../../services/socket/socketService";
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { receiverId, text, media } = req.body;
    const senderId = req.user?.id;

    const newMessage = await MessageServices.createMessage({
      senderId,
      receiverId,
      text,
      media,
    });

    const io = getIO();

    // Receiver কে message পাঠানো
    io.to(`user_${receiverId}`).emit("newMessage", {
      messageId: newMessage._id,
      senderId,
      receiverId,
      text,
      media,
      createdAt: newMessage.createdAt,
    });

    // Sender কে confirmation পাঠানো
    io.to(`user_${senderId}`).emit("messageSent", {
      messageId: newMessage._id,
      status: "delivered",
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
