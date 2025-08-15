import { Types } from "mongoose";

export interface IMessage {
  _id?: Types.ObjectId;
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  text: string;
  media?: string;
  seen: boolean;
  createdAt?: Date;
  isDeleted?: boolean;
}
