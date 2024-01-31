import React from "react";
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  Button,
  Toast,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import { ChatState } from "../../../contexts/CreateConText";
const SignUp = () => {
  const {setuser} = ChatState();
  const [show, setshow] = useState(false);
  const [conshow, setconshow] = useState(false);
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [conPassword, setconpassword] = useState("");
  const [picture, setpicture] = useState("");
  const [loading, setloading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const postdetails = async (data) => {
    setloading(true);
    if (data === undefined) {
      toast({
        title: "format",
        description: "please upload a pic in jpeg or png format.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setloading(false);
      return;
    }
    if (data.type === "image/jpeg" || data.type === "image/png") {
      try {
        const formData = new FormData();
        formData.append("file", data);
        formData.append("upload_preset", "chat-app"); // Replace with your Cloudinary upload preset

        fetch("https://api.cloudinary.com/v1_1/tanmaytrivedi/image/upload", {
          method: "POST",
          body: formData,
        })
          .then((response) => {
            return response.json();
          })
          .then((response) => {
            console.log(response.url);
            setpicture(response.url + "");
            setloading(false);
            toast({
              title: "success",
              description: "image uploaded successfully",
              status: "success",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
          });
      } catch (error) {
        console.log(error);
        setloading(false);
        toast({
          title: "Network error",
          description: "please upload again",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        return;
      }
    } else {
      setloading(false);
      toast({
        title: "Network error",     
        description: "please upload again",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
  };
  const submitHandler =async () => {
        setloading(true);
      if(!name || !email || !password)
      {
        toast({
          title: "fill all  feilds",
          description: "please enter again",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setloading(false);
        return;
      }
      if(password !== conPassword)
      {
          toast({
            title: "fill all reqd feilds",
            description: "please enter again",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          setloading(false);
          return;
      }
      try {
           const response =await axios.post('/api/users' , {
            name , email , password , picture
           },
         
            
           )
             console.log(response);
             setloading(false)
              toast({
                title: "success",
                description: "registered successfully",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
             setuser(response.data);
             localStorage.setItem("userInfo", JSON.stringify(response.data));
             setloading(false);
              navigate('/chats')
      } catch (error) {
        console.log(error)
      }

  };

  return (
    <VStack spacing={3}>
      <FormControl letterSpacing={"1px"} isRequired>
        <FormLabel> Full Name</FormLabel>
        <Input
          placeholder="enter your full name"
          onChange={(e) => {
            setname(e.target.value);
          }}
        ></Input>
        <FormLabel>Enter your email</FormLabel>
        <Input
          placeholder="enter your email"
          type="email"
          onChange={(e) => {
            setemail(e.target.value);
          }}
        ></Input>
        <FormLabel>password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder=" password"
            onChange={(e) => {
              setpassword(e.target.value);
            }}
          ></Input>
          <Button
            onClick={() => {
              setshow(!show);
            }}
          >
            {show ? "hide" : "show"}
          </Button>
        </InputGroup>

        <FormLabel>confirm password</FormLabel>
        <InputGroup>
          <Input
            type={conshow ? "text" : "password"}
            placeholder="password"
            onChange={(e) => {
              setconpassword(e.target.value);
            }}
          ></Input>
          <Button
            onClick={() => {
              setconshow(!conshow);
            }}
          >
            {conshow ? "hide" : "show"}
          </Button>
        </InputGroup>
        <FormLabel>upload profile picture</FormLabel>
        <Input
          type="file"
          padding={1.5}
          accept="image/*"
          onChange={(e) => {
            postdetails(e.target.files[0]);
          }}
          placeholder="select picture"
        ></Input>
      </FormControl>
      <Button
        colorScheme="blue"
        width={"100%"}
        onClick={submitHandler}
        isLoading={loading}
      >
        Sign up
      </Button>
    </VStack>
  );
};

export default SignUp;
