const express = require("express");
const app = express();
 const connectDb = require("./config/database.js")
 const User = require("./models/user.js");

 app.use(express.json());
app.post("/signup", async (req,res)=>{
   const user = new User(req.body);
  try{
   // if(User.findOne(req.body.emailId))
     // res.send("Email in Used");
    await user.save();
    res.send("User saved successfully");
  }
  catch(err){
    res.status(500).send("Something Went Wrong");
  }
})

app.get("/feed", async (req,res)=>{
  try{
    const user= await User.find({});
    console.log(user);
     res.send("All users")
  }
  catch{
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

app.patch("/user",async (req,res)=>{

    const userId = req.body.userId;
    const data = req.body;
    try{
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


