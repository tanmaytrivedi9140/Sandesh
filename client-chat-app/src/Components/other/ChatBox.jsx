import React from 'react'
import { ChatState } from '../../../contexts/CreateConText'
import { Box } from '@chakra-ui/react';
import SingleChat from './SingleChat';

const ChatBox = ({fetch , setfetch}) => {
  const { selectedChat } = ChatState();
  return (
    <>
      <Box
        display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
        alignItems="center"
        flexDir="column"
        p={3}
        bg="white"
        w={{ base: "100%", md: "68%" }}
        borderRadius="lg"
        borderWidth="1px"
        height={"85vh"}
      >
       <SingleChat fetch = {fetch} setfetch = {setfetch}></SingleChat>
      </Box>
    </>
  );
}

export default ChatBox
