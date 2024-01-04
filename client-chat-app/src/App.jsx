import { useState } from 'react'
import { Button } from '@chakra-ui/react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import HomePage from './Pages/HomePage'
import ChatPage from './Pages/ChatPage'
import OtpPage from './Pages/OtpPage'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/chats" element={<ChatPage/>}></Route>
          <Route path="/otpverify" element={<OtpPage />}></Route>
        </Routes>
      </div>
    </>
  );
}

export default App
