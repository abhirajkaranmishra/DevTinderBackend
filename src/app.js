const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const connectDB = require("./config/database.js");
const cookieParser = require("cookie-parser");
const User = require("./models/user.js");
const userAuth = require("./middleware/auth.js");
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(cookieParser());
app.post("/signup", async(req,res)=>{
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

app.post("/logIn",async (req,res)=>{
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
      res.send("LogIn successful");
    }
      
    else
      throw new Error("Invalid credentials");
  }
  catch(err){
     res.status(500).send("Error "+err.message);
  }
})

app.get("/profile",userAuth,async (req,res)=>{
  try
  {
    res.send(req.user.firstName+" view his profile");
  }
  catch(err)
  {
    res.status(400).send("Error "+err.message);
  }
})
 
app.patch("/profile/:userId",async (req,res)=>{
  try{
     const userId = req.params.userId;
     const ALLOWED_UPDATES = ["firstName","lastName","about","age","skills","photoURL","password"];
     const data = req.body;
     const USER_ALLOWED = Object.keys(data).every((k)=>
         ALLOWED_UPDATES.includes(k)
  );
     if(!USER_ALLOWED)
        throw new Error ("updation not Allowed"); 
     
      await User.findByIdAndUpdate({ _id: userId }, req.body,{runValidators:true});
      res.send("Updated Successfully");
  }
  catch(err){
    res.status(500).send("Error: "+err.message);
  }
})

connectDB().then(()=>{
  console.log("Database connected successfully");
  app.listen(3000,()=>{
  console.log("Application listening on port number 3000");
})
})
.catch((err)=>{
  console.err("Database not connected successfully");
})
