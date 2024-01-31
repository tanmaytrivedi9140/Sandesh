import React, { useEffect, useState } from "react";
import { Box, Tooltip, useToast, Button, Text, Stack } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { ChatState } from "../../../contexts/CreateConText";
import { getSender } from "../../../config/ChatLogic";
import axios from "axios";
import CreateGroupModal from "./CreateGroupModal";
const MyChats = ({ fetch }) => {
  const [loggeduser, setloggeduser] = useState();
  const { user, selectedChat, setselectedChat, chats, setchats } = ChatState();
  const toast = useToast();
  const fetchchats = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    try {
      const response = await axios.get("/api/chat", config);
      console.log(response);
      console.log(selectedChat);
      setchats(response.data);
    } catch (error) {
      toast({
        title: "Network issue in my chats",
        description: "please try again later",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  useEffect(() => {
    setloggeduser(JSON.parse(localStorage.getItem("userInfo")));
    fetchchats();
  }, [fetch]);
  return (
    <>
      <Box
        display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
        flexDir="column"
        alignItems="center"
        p={3}
        bg="white"
        w={{ base: "100%", md: "31%" }}
        borderRadius="lg"
        borderWidth="1px"
        height={"85vh"}
      >
        <Box
          pb={3}
          px={3}
          fontSize={{ base: "28px", md: "30px" }}
          fontFamily="Work sans"
          display="flex"
          w="100%"
          justifyContent="space-between"
          alignItems="center"
        >
          <Text fontSize={"25px"}>My chats</Text>

          <CreateGroupModal>
            <Button
              d="flex"
              fontSize={{ base: "10px", md: "10px", lg: "13px" }}
              rightIcon={<AddIcon />}
            >
              New Group Chat
            </Button>
          </CreateGroupModal>
        </Box>
        <Box
          display="flex"
          flexDir="column"
          p={3}
          bg="#F8F8F8"
          w="100%"
          h="100%"
          borderRadius="lg"
          overflowY="hidden"
        >
          {chats ? (
            <Stack overflowY={"scroll"} width={"100%"}>
              {chats.map((chat) => {
                return (
                  <Box
                    onClick={() => setselectedChat(chat)}
                    cursor="pointer"
                    width={"100%"}
                    bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                    color={selectedChat === chat ? "white" : "black"}
                    px={3}
                    py={2}
                    borderRadius="lg"
                    key={chat._id}
                  >
                    <Text>
                      {chat.isGroupChat
                        ? chat.chatName
                        : getSender(loggeduser, chat.users)}
                    </Text>
                  </Box>
                );
              })}
            </Stack>
          ) : (
            <ChatLoading />
          )}
        </Box>
      </Box>
    </>
  );
};

export default MyChats;
