import React, { useState } from "react";
import {
  Button,
  Input,
  Skeleton,
  Spinner,
  useToast,
  Stack,
  Box,
} from "@chakra-ui/react";
import axios from "axios";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import { ChatState } from "../../../contexts/CreateConText";
import UserList from "../UserDisplay/UserList";
import UserBadge from "./UserBadge";
const CreateGroupModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupname, setgroupname] = useState();
  const [searchusers, setsearchusers] = useState([]);
  const [search, setsearch] = useState();
  const [selectedusers, setselectedusers] = useState([]);
  const [loading, setloading] = useState(false);
  const toast = useToast();
  const { user, setchats, chats } = ChatState();
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
      setsearchusers(response.data);
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
  const handlegroup = (u) => {
    if (selectedusers.includes(u)) {
      toast({
        title: "user already included",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }
    setselectedusers([...selectedusers, u]);
  };
  const handleSubmit = async () => {
    if (!groupname && !selectedusers) {
      toast({
        title: "please fill all feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    } else if (selectedusers.length <= 1) {
      toast({
        title: "please add more than one user!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const response = await axios.post(
        `/api/chat/group`,
        {
          name: groupname,
          users: JSON.stringify(selectedusers.map((u) => u._id)),
        },
        config
      );
      console.log(response.data);
      const { data } = response;
      setchats([data, ...chats]);
      onClose();
      toast({
        title: "New Group Chat Created!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Failed to Create the Chat!",
        description: error.response.data,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const handledelete = (u) => {
    setselectedusers(selectedusers.filter((s) => s._id !== u._id));
  };
  return (
    <>
      <Button onClick={onOpen}>{children}</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            New Group
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* rendering the users */}
            <FormControl mb={"10px"}>
              <Input
                placeholder="Group Name ..."
                value={groupname}
                onChange={(e) => {
                  setgroupname(e.target.value);
                }}
              ></Input>
            </FormControl>
            <FormControl mb={"10px"}>
              <Input
                placeholder="search for users ..."
                onChange={(e) => {
                  handlesearch(e.target.value);
                }}
              ></Input>
            </FormControl>
            {
              <Box display={"flex"} flexWrap={"wrap"}>
                {selectedusers.map((u) => {
                  return (
                    <UserBadge
                      user={u}
                      key={u._id}
                      handleDelete={() => handledelete(u)}
                    ></UserBadge>
                  );
                })}
              </Box>
            }

            {loading ? (
              <Stack>
                <Skeleton height="25px" />
                <Skeleton height="25px" />
                <Skeleton height="25px" />
              </Stack>
            ) : (
              searchusers.slice(0, 3).map((u) => {
                return (
                  <UserList
                    key={u._id}
                    user={u}
                    handleFunction={() => handlegroup(u)}
                  ></UserList>
                );
              })
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              create group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateGroupModal;
// `
