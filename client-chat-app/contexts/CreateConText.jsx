import React, { createContext ,useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const chatcontext = createContext()


const ChatProvider = ({children}) => {
    const [user ,setuser] = useState();
    const [ selectedChat , setselectedChat] = useState();
    const [chats , setchats] = useState([]);
    const navigate  = useNavigate()
    
    useEffect(()=>{
       const userInfo = JSON.parse(localStorage.getItem("userInfo"));
       console.log(userInfo);
       setuser(userInfo)
       if(!userInfo)
       {
         navigate('/')
       }
    else{
        navigate('/chats')
    }
    },[navigate])
  

    return (
      <chatcontext.Provider
        value={{
          user,
          setuser,
          selectedChat,
          setselectedChat,
          chats,
          setchats,
        }}
      >
        {children}
      </chatcontext.Provider>
    );
}

export const ChatState = () =>{
return useContext(chatcontext);
}



export default ChatProvider;