import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  Button,
  IconButton,
  Input,
  useToast,
  Box,
  Stack,
  Skeleton,
} from "@chakra-ui/react";
import { ChatState } from "../../../contexts/CreateConText";
import { ViewIcon } from "@chakra-ui/icons";
import UserBadge from "./UserBadge";
import axios from 'axios'
import UserList from "../UserDisplay/UserList";
const GroupChatModal = ({ fetch, setfetch ,fetchMessages }) => {
  const [groupname, setgroupname] = useState();
  const { user, selectedChat, setselectedChat } = ChatState();
  const [loading, setloading] = useState();
  const [updateloading, setupdateloading] = useState(false);
  const [search, setsearch] = useState();
  const [searchresult, setsearchresult] = useState([]);
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleadduser =async (user1) =>{
        if(selectedChat.users.find((s)=>s._id === user1._id))
        {
           toast({
             title: "User already added in group",
             status: "warning",
             duration: 5000,
             isClosable: true,
             position: "bottom-left",
           });
           return;
        }
        if(selectedChat.groupAdmin._id !== user._id)
        {
          toast({
            title: "Only admin can add on the group",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
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
      const response = await axios.post(
        `/api/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: user1._id
        },
        config
      );
      console.log(response);
      setselectedChat(response.data);
      setfetch(!fetch)
      setloading(false);
        } catch (error) {
           toast({
             title: "Network issue",
             status: "error",
             duration: 5000,
             isClosable: true,
             position: "bottom-left",
           });
           setloading(false);
           return;
        }
  }
  const handleremove = async(user1) => {
        if(selectedChat.groupAdmin._id !== user._id)
        {
          toast({
            title: "Only admin can add on the group",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
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
      const response = await axios.post(
        `/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1._id
        },
        config
      );
      console.log(response);
      setselectedChat(response.data);
      setfetch(!fetch)
      setloading(false);
        } catch (error) {
           toast({
             title: "Network issue",
             status: "error",
             duration: 5000,
             isClosable: true,
             position: "bottom-left",
           });
           setloading(false);
           return;
        }
  };
  const handlerename = async () => {
    if (!groupname) return;
    try {
      setupdateloading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const response = await axios.put(
        "api/chat/rename",
        {
          chatId: selectedChat._id,
          chatName: groupname,
        },
        config
      );
      const data = response.data;
      setselectedChat(data);
      setfetch(!fetch);
      fetchMessages();
      setupdateloading(false);
    } catch (error) {
      toast({
        title: "Failed to Update the Chat!",
        description: error.response.data,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setupdateloading(false);
    }
    setgroupname("");
  };
  const handlesearch = async (query) => {
    setsearch(query);
    setloading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const response = await axios.get(`/api/users?search=${query}`, config);
      console.log(response);
      setsearchresult(response.data);
      setloading(false);
    } catch (error) {
      toast({
        title: "Network issue",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        icon={<ViewIcon />}
        onClick={onOpen}
      />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            fontSize={"25px"}
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box display="flex" flexWrap={"wrap"}>
              {selectedChat.users.map((u) => {
                return (
                  <UserBadge
                    user={u}
                    key={u._id}
                    handleDelete={() => handleremove(u)}
                  ></UserBadge>
                );
              })}
            </Box>

            <FormControl display={"flex"} mb={"10px"}>
              <Input
                placeholder="edit group name...."
                mr={"5px"}
                value={groupname}
                onChange={(e) => {
                  setgroupname(e.target.value);
                }}
              />
              <Button
                colorScheme="teal"
                isLoading={updateloading}
                onClick={handlerename}
              >
                update
              </Button>
            </FormControl>
            <FormControl display={"flex"}>
              <Input
                placeholder="Add group members...."
                onChange={(e) => {
                  handlesearch(e.target.value);
                }}
              />
            </FormControl>
            {loading ? (
              <Stack>
                <Skeleton height="25px" />
                <Skeleton height="25px" />
                <Skeleton height="25px" />
              </Stack>
            ) : (
              searchresult.slice(0, 3).map((u) => {
                return (
                  <UserList
                    key={u._id}
                    user={u}
                    handleFunction={() => handleadduser(u)}
                  ></UserList>
                );
              })
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={() => handleremove(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
