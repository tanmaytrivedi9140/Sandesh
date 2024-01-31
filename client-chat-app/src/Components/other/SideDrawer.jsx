import { useState } from "react";
import React from "react";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import {
  Box,
  Tooltip,
  Button,
  Text,
  Menu,
  MenuButton,
  MenuList,
  Avatar,
  MenuItem,
  MenuDivider,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { ChatState } from "../../../contexts/CreateConText";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Input,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import UserList from "../UserDisplay/UserList";
const SideDrawer = () => {
  const { user, setselectedChat,chats ,setchats } = ChatState();
  const navigate = useNavigate();
  const [search, setsearch] = useState("");
  const [searchResult, setsearchResult] = useState([]);
  const [loading, setloading] = useState(false);
  const [loadingChat, setloadingChat] = useState(false);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const logout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };
  console.log(searchResult);
  const toast = useToast();
  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Input",
        description: "please fill the search feild",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      setloading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const response = await axios.get(`/api/users?search=${search}`, config);
      setloading(false);
      console.log(response.data);
      setsearchResult(response.data);
    } catch (error) {
      toast({
        title: "Network issue",
        description: "please try again later",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }
  };
  const accessChat = async (userId) => {
    setloadingChat(true);
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    };
    try {
       const response = await axios.post("/api/chat", { userId }, config);
       console.log(response);
       const {data} = response;
       if(!chats.find((c)=>c._id === data._id))
       {
        setchats([data ,...chats])
       }
       setselectedChat(data);
       setloadingChat(false);
       onClose();
    } catch (error) {
      toast({
        title: "Network issue",
        description: "please try again later",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
   
  };
  
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="search for users" hasArrow placement="bottom-end">
          <Button variant={"ghost"} onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text d={{ base: "none", md: "flex" }} px={"5px"}>
              search for users
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="monospace">
          Sandesh
        </Text>
        <div>
          <Menu>
            <MenuButton>
              <BellIcon fontSize={"3xl"} />
            </MenuButton>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              ></Avatar>
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search for Users</DrawerHeader>
          <DrawerBody>
            <Box display={"flex"} py={"10px"}>
              <Input
                display={"flex"}
                placeholder="search here ..."
                value={search}
                onChange={(e) => {
                  setsearch(e.target.value);
                }}
              ></Input>
              <Button onClick={handleSearch}>Go</Button>
            </Box>

            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => {
                return (
                  <UserList
                    user={user}
                    handleFunction={() => accessChat(user._id)}
                  />
                );
              })
            )}
            {loadingChat && (
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="md"
                ml={"auto"}
                display={"flex"}
              />
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
