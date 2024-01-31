const express = require("express");
const chats = require("./data");
const app = express();
const connectDb = require("./dbConfig/db");
const colors = require("colors");
const userRoutes = require("./Routes/userRoutes");
const chatRoutes = require("./Routes/chatRoutes");
const messageRoutes = require("./Routes/MessageRoutes");

const socket = require("socket.io");
require("dotenv").config();
connectDb();
app.use(express.json());
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, (req, res) => {
  console.log("listening on port 5000".green.bold);
});
app.use("/users", userRoutes);
app.use("/chat", chatRoutes);
app.use("/message", messageRoutes);
app.use("/otp", userRoutes);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173",
    // credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("New connection");

  socket.on("setup", (userdata) => {
    console.log(userdata._id);

    socket.join(userdata._id);
    socket.emit("connected");
  });
  socket.on("join room", (room) => {
    socket.join(room);
    console.log("user joined the room " + room);
  });
   socket.on("typing", (room) => socket.in(room).emit("typing"));
   socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
  socket.on("new message", (newmessage) => {
    var chat = newmessage.chat;
    console.log(newmessage);
    if (!chat.users) return console.log("chat.users not defined");
    chat.users.forEach((user) => {
      if (user._id == newmessage.sender._id) return console.log("inside if");
      else {
        console.log("inside else");
        socket.in(user._id).emit("message recieved", newmessage);
      }
    });
  });
});
