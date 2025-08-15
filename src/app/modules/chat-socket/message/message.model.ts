import { Schema, model } from "mongoose";
import { IMessage } from "./message.interface";

// Schema definition
const messageSchema = new Schema<IMessage>(
  {
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String },
    media: { type: String }, // Array of media URLs or paths
    seen: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true, // createdAt, updatedAt automatically added
  }
);

export const Message = model<IMessage>("Message", messageSchema);
