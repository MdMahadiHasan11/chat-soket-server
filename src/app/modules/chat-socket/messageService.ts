import httpStatus from "http-status-codes";
import { IMessage } from "./message/message.interface";
import AppError from "../../errorHelpers/AppError";
import { User } from "../ph-tour/user/user.model";
import { Message } from "./message/message.model";

const createMessage = async (payload: Partial<IMessage>): Promise<IMessage> => {
  const { senderId, receiverId } = payload;

  if (!senderId || !receiverId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "senderId and receiverId are required to create a message"
    );
  }

  const receiverExists = await User.findById(receiverId);
  if (!receiverExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "Receiver does not exist");
  }

  const message = new Message(payload);
  await message.save();

  // Populate for response
  await message.populate([
    { path: "senderId", select: "name email avatar" },
    { path: "receiverId", select: "name email avatar" },
  ]);

  return message;
};

const getAllMessages = async (userId: string, receiverId: string) => {
  if (!receiverId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Receiver ID is required");
  }

  const userExists = await User.findById(userId);
  if (!userExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
  }

  const allMessages = await Message.find({
    $or: [
      { senderId: userId, receiverId: receiverId },
      { senderId: receiverId, receiverId: userId },
    ],
    isDeleted: false,
  })
    .populate("senderId", "name email avatar")
    .populate("receiverId", "name email avatar")
    .sort({ createdAt: -1 });

  // Mark messages as seen
  await Message.updateMany(
    { senderId: receiverId, receiverId: userId, seen: false },
    { seen: true }
  );

  if (!allMessages || allMessages.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, "No messages found");
  }

  return {
    data: allMessages,
    meta: {
      total: allMessages.length,
    },
  };
};

const getAllMessagesOneUser = async (userId: string) => {
  const allMessages = await Message.find({
    senderId: userId,
    isDeleted: false,
  })
    .populate("receiverId", "name email avatar")
    .sort({ createdAt: -1 });

  if (!allMessages || allMessages.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, "No messages found");
  }

  return {
    data: allMessages,
    meta: {
      total: allMessages.length,
    },
  };
};

const markAsSeen = async (
  messageId: string,
  userId: string
): Promise<boolean> => {
  if (!messageId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Message ID is required to mark as seen ${userId}`
    );
  }

  const message = await Message.findByIdAndUpdate(messageId, { seen: true });
  if (!message) {
    throw new AppError(httpStatus.BAD_REQUEST, "Message does not exist");
  }

  return true;
};

const getAllUsersForSidebar = async (userId: string) => {
  const users = await User.find({ _id: { $ne: userId } }).select("-password");
  const totalUsers = await User.countDocuments();

  const unseenMessages: Record<string, number> = {};
  const promises = users.map(async (user) => {
    const count = await Message.countDocuments({
      senderId: user._id,
      receiverId: userId,
      seen: false,
      isDeleted: false,
    });

    if (count > 0) {
      unseenMessages[user._id.toString()] = count;
    }
  });

  await Promise.all(promises);

  return {
    data: [users, unseenMessages],
    meta: {
      total: totalUsers,
    },
  };
};

const getMessageById = async (messageId: string): Promise<IMessage | null> => {
  if (!messageId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Message ID is required");
  }

  const message = await Message.findById(messageId)
    .populate("senderId", "name email avatar")
    .populate("receiverId", "name email avatar");

  if (!message) {
    throw new AppError(httpStatus.NOT_FOUND, "Message not found");
  }

  return message;
};

export const MessageServices = {
  createMessage,
  getAllMessages,
  getAllMessagesOneUser,
  markAsSeen,
  getAllUsersForSidebar,
  getMessageById, // Added getMessageById to exports
};
