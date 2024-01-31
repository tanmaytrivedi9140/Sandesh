const express = require('express')
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../Models/userModel')
require('dotenv').config();
exports.tokenverify = asyncHandler(async(req,res,next)=>{
      console.log("inside")
      try {
        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer"))
        {
            const token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
             console.log(decoded)
             req.user =await User.findById(decoded.id).select("-password");
             console.log(req.user);
             next();
              console.log("after next")
        }
      } catch (error) {
        res.status(401).send(error);
      }
})