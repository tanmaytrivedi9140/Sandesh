import React, { useEffect, useState } from "react";
import { ChatState } from "../../../contexts/CreateConText";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../../../config/ChatLogic";
import ProfileModal from "./ProfileModal";
import GroupChatModal from "./GroupChatModal";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import '../../App.css'
import Lottie from "react-lottie";
import animationData from "../../animations/typing.json";
import ScrollableChat from "./ScrollableChat";
import io from 'socket.io-client'
const ENDPOINT = "http://localhost:5000";
var socket ,selectedchatCompare;


const SingleChat = ({ fetch, setfetch }) => {
  const [loading, setloading] = useState(false);
  const [message, setMessage] = useState([]);
  const [latestMessage, setlatestMessage] = useState();
  const { user, selectedChat, setselectedChat } = ChatState();
  const [socketconnected , setsocketconnected] = useState(false);
   const [typing, setTyping] = useState(false);
   const [istyping, setIsTyping] = useState(false);
  const toast = useToast();
   const defaultOptions = {
     loop: true,
     autoplay: true,
     animationData: animationData,
     rendererSettings: {
       preserveAspectRatio: "xMidYMid slice",
     },
   };
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", ()=>setsocketconnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

  },[]);
  const messageHandler = async (event) => {
    if (event.key === "Enter" && latestMessage) {
      try {
       socket.emit("stop typing", selectedChat._id);
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setloading(true);
        const response = await axios.post(
          "/api/message",
          {
            ChatId: selectedChat._id,
            content: latestMessage,
          },
          config
        );
         setlatestMessage("");
        const data = response.data;
        
        socket.emit("new message", data);
        setMessage([...message, data]);
        setloading(false);
      } catch (error) {
        toast({
          title: "Failed to Update the Chat!",
          description: error.response.data,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  const typingHandler = (e) => {
    setlatestMessage(e.target.value);
    // typing logic implemented
      if (!socketconnected) return;

      if (!typing) {
        setTyping(true);
        socket.emit("typing", selectedChat._id);
      }
      let lastTypingTime = new Date().getTime();
      var timerLength = 3000;
      setTimeout(() => {
        var timeNow = new Date().getTime();
        var timeDiff = timeNow - lastTypingTime;
        if (timeDiff >= timerLength && typing) {
          socket.emit("stop typing", selectedChat._id);
          setTyping(false);
        }
      }, timerLength);
  };

  const fetchChats = async () => {
     if (!selectedChat) return;
    try {
      console.log("iside fetch chats")
      setloading(true);


      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
    
      const response = await axios.get(
        `api/message/:${selectedChat._id}`,
        config
      );
      console.log(response);
      const data = response.data;
      setloading(false);
      socket.emit("join room" , selectedChat._id)
      setMessage(response.data);
    } catch (error) {
      toast({
        title: "Failed to Update the Chat!",
        description: error.response.data,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
   useEffect(() => {
     fetchChats();
     selectedchatCompare = selectedChat;
   }, [selectedChat]);
 useEffect(()=>{
  socket.on("message recieved", (newmessage) => {
    console.log("inside message received")
    console.log(newmessage)
    if (
      !selectedchatCompare || // if chat is not selected or doesn't match current chat
      selectedchatCompare._id !== newmessage.chat._id
    ) {
      console.log("inside notification")
    } else {
      console.log("inside selected chat");
      setMessage([...message, newmessage]);
    }
  });
 })

 
  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              mr={"15px"}
              d={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setselectedChat("")}
            ></IconButton>
            {selectedChat.isGroupChat ? (
              <>
                {selectedChat.chatName.toUpperCase()}
                <GroupChatModal
                  fetch={fetch}
                  setfetch={setfetch}
                  fetchMessages={fetchChats}
                />
              </>
            ) : (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal
                  user={getSenderFull(user, selectedChat.users)}
                ></ProfileModal>
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size={"xl"}
                height={"20"}
                width={"20"}
                alignSelf={"center"}
                margin={"auto"}
              />
            ) : (
              <>
                <div className="chat-message-render">
                  {" "}
                  <ScrollableChat messages={message} />
                </div>
              </>
            )}
            <FormControl onKeyDown={messageHandler} isRequired>
              {istyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    // height={50}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}
              <Input
                variant={"filled"}
                background={"#E0E0E0"}
                placeholder={"enter a message ...."}
                value={latestMessage}
                onChange={typingHandler}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
