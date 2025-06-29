const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user.js");

authRouter.post("/signUp",async(req,res)=>{
  try{
    const {firstName, lastName, emailId, password} = req.body;
    const passwordHash =await bcrypt.hash(password,10);
    const user = new User({firstName, lastName, emailId, password:passwordHash});
    await user.save();
    res.send("SignUp successfully");
  }
  catch(err){
    res.status(500).send("Error: "+ err.message);
  }
});

authRouter.post("/login",async (req,res)=>{
  try{
    const {emailId,password} = req.body;
    const user = await User.findOne({emailId:emailId});
    if(!user)
      throw new Error("Invalid credentials");
    const isPasswordValid= await user.validatePassword(password);
    if(isPasswordValid)
    {
      const token =await user.getJwtToken();
      res.cookie("token",token);
      res.send(user);
    }
      
    else
      throw new Error("Invalid credentials");
  }
  catch(err){
     res.status(500).send("Error "+err.message);
  }
});

authRouter.post("/logout",async (req,res)=>{
   res.cookie("token",null,{expires:new Date(Date.now())});
   res.send("Logout successfully");
});

module.exports = authRouter;