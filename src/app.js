const express = require("express");
const app = express();
 const connectDb = require("./config/database.js")
 const User = require("./models/user.js");

 app.use(express.json());
app.post("/signup", async (req,res)=>{
   const user = new User(req.body);
  try{
    await user.save();
    res.send("User saved successfully");
  }
  catch{
    res.status(500).send("something went wrong");
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
      await User.findByIdAndUpdate(userId,data);
      res.send("User Updated");
    }
    catch{
      res.status(500).send("Something went wrong");
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


