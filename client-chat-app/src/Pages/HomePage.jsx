import React, { useEffect } from "react";
import { Box, Container, Text } from "@chakra-ui/react";
import { Tabs , Tab , TabList ,TabPanel ,TabPanels } from "@chakra-ui/react";
import Login from "../Components/Authorization/Login";
import SignUp from "../Components/Authorization/SignUp";
import { useNavigate } from "react-router-dom";
function HomePage() {
  const navigate = useNavigate();
  useEffect(()=>{
     const userInfo = JSON.parse(localStorage.getItem("userInfo"));
     console.log(userInfo)
     if (userInfo) {
       navigate("/chats");
     }
     else{
      navigate('/')
     }
  },[navigate]);
  return (
    <Container maxW="xl" centerContent>
      <Box
        display="flex"
        justifyContent="center"
        p={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize={"4xl"} fontFamily={"Nunito"}>
          Sandesh
        </Text>
      </Box>
      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
        <Tabs isFitted variant="enclosed">
          <TabList mb="1em">
            <Tab>Login</Tab>
            <Tab>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}

export default HomePage;
