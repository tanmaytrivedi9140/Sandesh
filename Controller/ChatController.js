const express = require("express");
const asynchandler = require("express-async-handler");
const Chat = require("../Models/ChatModel");
const User = require("../Models/userModel");
exports.accessChat = asynchandler(async (req, res) => {
  // route for creating new chats
  const { userId } = req.body;
  if (!userId) {
    res.status(401);
    throw new Error("user does not exist");
  }
  // find the chat if any chat exists with that user or not
  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");
  // then add the chat and latest message to that user

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name email pic",
  });
  // send back the response after populating the message and the particular user
  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    // if chat don't exists then create new chat
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
  }
  try {
    // create a new chat in the chat model
    // same logic as the previous one then populate it with the users and send the chat
    const createdChat = new Chat(chatData);
    await createdChat.save();

    const fullChat = await Chat.findOne({
      _id: createdChat._id,
    }).populate("users", "-password");
    res.status(201).send(fullChat);
  } catch (error) {
    res.send(401);
    throw new Error(error.message);
  }
});

exports.fetchChats = asynchandler(async (req, res) => {
  try {
    // first find the chat then start populating with the users
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name email pic",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.send(401);
    throw new Error(error.message);
  }
});

exports.createGroupChat = asynchandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    res.send(401);
    throw new Error("please fill all entries");
  }
  var users = JSON.parse(req.body.users);

  users.push(req.user);
  if (users.length < 2) {
    res.send(401);
    throw new Error("less than two members not a group chat");
  }
  try {
    const groupchat = new Chat({
      chatName: req.body.name,
      isGroupChat: true,
      users: users,
      groupAdmin: req.user,
    });
    await groupchat.save();
    console.log(groupchat);
    const fullGroupChat = await Chat.findOne({ _id: groupchat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    console.log(fullGroupChat);
    res.status(200).send(fullGroupChat);
  } catch (error) {
    res.status(401);
    throw new Error(error.message);
  }
});

exports.renameGroup = asynchandler(async (req, res) => {
  console.log("inside");
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { chatName: chatName },
    { new: true }
  )

    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!updatedChat) {
    res.status(401);
    throw new Error(error.message);
  } else {
    res.status(200).send(updatedChat);
  }
});

exports.addToGroup = asynchandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const added = await Chat.findByIdAndUpdate(
    chatId,
    { $push: { users: userId } },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
   if (!added) {
     res.status(401);
     throw new Error(error.message);
   } else {
     res.status(200).send(added);
   }

});

exports.removefromGroup = asynchandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const remove = await Chat.findByIdAndUpdate(
    chatId,
    { $pull: { users: userId } },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!remove) {
    res.status(401);
    throw new Error(error.message);
  } else {
    res.status(200).send(remove);
  }
});
