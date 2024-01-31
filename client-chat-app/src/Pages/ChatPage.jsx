import React, { useEffect, useState } from "react";
import axios from "axios";
import SideDrawer from "../Components/other/SideDrawer.jsx";
import MyChats from "../Components/other/MyChats.jsx";
import ChatBox from "../Components/other/ChatBox.jsx";
import { Box } from "@chakra-ui/react";
import { ChatState } from "../../contexts/CreateConText.jsx";
function ChatPage() {
  const { user } = ChatState();
const [fetch , setfetch] = useState(false);


  return (
    <div style={{ width: "100%" }}>
      
      {user && <SideDrawer />}
      <Box
      display={"flex"}
      justifyContent={"space-between"}
      w={"100%"}
      height={"80vh"}
      padding={"15px"}>
        {user && <MyChats fetch = {fetch}/>}
        {user && <ChatBox fetch = {fetch} setfetch = {setfetch}/>}
      </Box>
    </div>
  );
}

export default ChatPage;
