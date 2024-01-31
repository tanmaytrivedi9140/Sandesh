import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  Button,
  useToast
} from "@chakra-ui/react";
import axios from "axios";
import React from "react";
import { useState } from "react";
import { ChatState } from "../../../contexts/CreateConText";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const { setuser } = ChatState();
  const [show, setshow] = useState(false);
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [loading ,setloading] = useState(false)
   const toast = useToast();
   const navigate = useNavigate();
  const submitHandler = async() => {
    setloading(true);
      if( !email || !password )
      {
        toast({
          title: "fill all feilds",
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
           const response =await axios.post('/api/users/login' , {
           
            email , password 
           }
          )
             console.log(response.data);
             setloading(false)
              toast({
                title: "success",
                description: "login successful",
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
        toast({
          title: "network issue",
          description: "please enter again",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setloading(false)
        console.log(error)
      }
  };

  return (
    <VStack spacing={3}>
      <FormControl letterSpacing={"1px"} isRequired>
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
      </FormControl>
      <Button colorScheme="blue" width={"100%"}
      isLoading = {loading}
       onClick={submitHandler}>
        Sign up
      </Button>
      <Button
        variant={"solid"}
        colorScheme="red"
        width={"100%"}
        onClick={() => {
          setemail("guest@example.com");
          setpassword("123456");
          submitHandler();
        }}
      >
       Login as a Guest
      </Button>
    </VStack>
  );
};

export default Login;
