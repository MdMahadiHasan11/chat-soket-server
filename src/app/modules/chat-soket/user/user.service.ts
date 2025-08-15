import { User } from "../../ph-tour/user/user.model";
import { Message } from "../message/message.model";
// import { User } from "./user.model";

const getAllUsersForSidebar = async (id: string) => {
  // console.log("id", id);
  const users = await User.find({ _id: { $ne: id } }).select("-password");

  //unSeen messages
  const totalUsers = await User.countDocuments();

  const unseenMessages: Record<string, number> = {};
  const promises = users.map(async (user) => {
    const messages = await Message.find({
      senderId: user._id,
      receiverId: id,
      seen: false,
    });

    if (messages.length > 0) {
      unseenMessages[user._id.toString()] = messages.length;
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

export const UserServices = {
  getAllUsersForSidebar,
};
