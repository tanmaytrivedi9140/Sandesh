const asynchandler = require("express-async-handler");
const Message = require("../Models/messageModel");
const User = require("../Models/userModel");
const Chat = require("../Models/ChatModel");

exports.sendMessage = asynchandler(async (req, res) => {
  try {
    const { content, ChatId } = req.body;
    var message = {
      sender: req.user,
      content: content,
      chat: ChatId,
    };
    var messagesave = new Message(message);
    await messagesave.save();
    messagesave = await messagesave.populate([
      { path: "sender", select: "name pic" },
      { path: "chat" },
    ]);
    messagesave = await User.populate(messagesave, {
      path: "chat.users",
      select: "name email pic",
    });

    const latestMessage = await Chat.findByIdAndUpdate(ChatId, {
      latestMessage: messagesave,
    });
  // console.log(messagesave)
    res.json(messagesave);
  } catch (error) {
    res.status(404);
    throw new Error(error);
  }
});
exports.allMessages = asynchandler(async (req, res) => {
  try {

    console.log(req.params.chatId.slice(1));
    const chatId = req.params.chatId.slice(1);
    const message = await Message.find({chat : chatId})
      .populate("sender", "name email pic")
      .populate("chat");

    res.json(message);
  } catch (error) {
    res.status(404);
    throw new Error(error);
  }
});
