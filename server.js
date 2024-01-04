const express = require('express');
const chats = require('./data')
const app = express();
const connectDb = require('./dbConfig/db')
const colors = require('colors')
const userRoutes = require('./Routes/userRoutes')
const chatRoutes = require('./Routes/chatRoutes')

require('dotenv').config();
connectDb();
app.use(express.json());
const PORT = process.env.PORT || 5000;
app.listen(PORT , (req , res)=>{
    console.log("listening on port 5000".green.bold);
}); 
app.use('/users' , userRoutes);
app.use('/chat' , chatRoutes)
app.use("/otp", userRoutes);