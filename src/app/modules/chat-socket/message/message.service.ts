// import { io } from "../../../../server";
// import AppError from "../../../errorHelpers/AppError";
// import { User } from "../../ph-tour/user/user.model";
// import { IMessage } from "./message.interface";
// import { Message } from "./message.model";
// import httpStatus from "http-status-codes";
// // import { io, userSocketMap } from "../../../../server";

// // Function to send message and create a new message
// const createMessage = async (payload: IMessage) => {
//   // const existingDivision = await Message.findOne({ name: payload.name });
//   const { senderId, receiverId } = payload;

//   if (!senderId && !receiverId) {
//     throw new AppError(
//       httpStatus.BAD_REQUEST,
//       "senderId and receiverId are required to create a message"
//     );
//   }
//   const receiverExists = await User.findOne({ _id: receiverId });
//   if (!receiverExists) {
//     throw new AppError(httpStatus.BAD_REQUEST, "Receiver does not exist");
//   }

//   const message = new Message(payload);
//   await message.save();

//   //emit message to socket
//   const receiverSocketId = userSocketMap[receiverId];
//   if (receiverSocketId) {
//     io.to(receiverSocketId).emit("newMessage", message);
//   }

//   return message;
// };

// const getAllMessages = async (id: string, receiverId: string) => {
//   // console.log("id", id);

//   if (!receiverId) {
//     throw new AppError(httpStatus.BAD_REQUEST, "User ID is required");
//   }

//   const isExist = await User.findById(id);
//   if (!isExist) {
//     throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
//   }

//   const allMessages = await Message.find({
//     $or: [
//       { senderId: id, receiverId: receiverId },
//       { senderId: receiverId, receiverId: id },
//     ],
//   }).sort({ createdAt: -1 });
//   await Message.updateMany(
//     { senderId: receiverId, receiverId: id },
//     { seen: true }
//   );

//   if (!allMessages || allMessages.length === 0) {
//     throw new AppError(httpStatus.NOT_FOUND, "No messages found");
//   }

//   return {
//     data: allMessages,
//     meta: {
//       total: allMessages.length,
//     },
//   };
// };

// const getAllMessagesOneUser = async (id: string) => {
//   // console.log("id", id);

//   const allMessages = await Message.find({ senderId: id }).sort({
//     createdAt: -1,
//   });

//   if (!allMessages || allMessages.length === 0) {
//     throw new AppError(httpStatus.NOT_FOUND, "No messages found");
//   }

//   return {
//     data: allMessages,
//     meta: {
//       total: allMessages.length,
//     },
//   };
// };

// const markAsSeen = async (id: string, userId: string) => {
//   // const existingDivision = await Message.findOne({ name: payload.name });

//   if (!id) {
//     throw new AppError(
//       httpStatus.BAD_REQUEST,
//       "Message ID is required to mark as seen"
//     );
//   }
//   // console.log("id", id, "userId", userId);
//   // const messageExists = await Message.findOne({ _id: id, senderId: userId });

//   const receiverExists = await Message.findByIdAndUpdate(id, { seen: true });
//   if (!receiverExists) {
//     throw new AppError(httpStatus.BAD_REQUEST, "Message does not exist");
//   }

//   return true;
// };

// export const MessageServices = {
//   createMessage,
//   getAllMessages,
//   getAllMessagesOneUser,
//   markAsSeen,
// };
