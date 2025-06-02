const express = require("express");
const app = express();
 const connectDb = require("./config/database.js")
 const User = require("./models/user.js");
 const validateSignUpData = require("./utils/validation.js");
 const bcrypt = require("bcrypt");

 app.use(express.json());

app.post("/logIn",async (req,res)=>
  {
    const {emailId, password} = req.body;
  try{
    const user = await User.findOne({emailId:emailId});
    if(!user)
     throw new Error("Invalid credentials");
    const isPasswordValid = bcrypt.compare(password,user.password);
    if(isPasswordValid)
     res.send("Login successfull");
    else
     throw new Error("Invalid credentials");
}
catch(err){
  res.status(400).send("Error:"+ err.message);
}
})


app.post("/signup", async (req,res)=>{ 
  try{
    const {firstName, lastName, emailId, password} = req.body;
    validateSignUpData(req);
    const passwordHash =await bcrypt.hash(password,10);
    console.log(passwordHash);
    const user = new User({firstName, lastName, emailId, password:passwordHash});
    await user.save();
    res.send("User saved successfully");
  }
  catch(err){
    res.status(500).send("Something Went Wrong: "+err.message);
  }
})


app.get("/feed", async (req,res)=>{
  try{
    const user= await User.find({});
    console.log(user);
     res.send("All users")
  }
  catch(err){
    res.status(500).send("Something went wrong");
  }
})


app.delete("/user",async (req,res)=>{

  const userId = req.body.userId;
  try{
    await User.findByIdAndDelete(userId);
    res.send("User Deleted")
  }
  catch{
    res.status(500).send("Something went wrong");
  }
})


app.patch("/user/:userId",async (req,res)=>{

    const userId = req.params?.userId;
    const data = req.body;
    try{
      const ALLOWED_UPDATE = ["firstName","lastName","password"," photoUrl","about","skills"]
      const isUpdateAllowed = Object.keys(data).every((k)=>
      ALLOWED_UPDATE.includes(k))
      if(!isUpdateAllowed)
        res.status(500).send("This field can't be updated");
      await User.findByIdAndUpdate(userId,data,{runValidators:true});
      res.send("User Updated");
    }
    catch(err){
      res.status(500).send("Something went wrong:"+ err.message);
    }
})


connectDb()
.then(()=>{
  console.log("Database Connected");
  app.listen(3000,()=>{
    console.log("printed");
  })
})
.catch((err)=>{
  console.error("Database not Connected");
}) 


