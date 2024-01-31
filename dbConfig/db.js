const mongoose = require('mongoose');
const colors = require("colors");

require('dotenv').config();
const dbConnect =async () =>{
 try {
    const connect =await  mongoose.connect(process.env.MONGO_URL);
    console.log({"mongo Db connected" : connect.connection.host});

 } catch (error) {
    console.log(error);
 }
} 
    
module.exports = dbConnect 