const express = require("express");
const app = express();
 const connectDb = require("./config/database.js")
 const User = require("./models/user.js");

app.post("/signUp", async (req,res)=>{
  const userObj ={
    "firstName":"Akshay",
    "lastName":"Saini",
    "emailId":"karan12342gmail.com",
    "password":"1234Aks",
    "age":"22",
    "gender":"Male"
   }
   const user = new User(userObj);
   try{
    await user.save();
    res.send("User Saved")
   }
   catch(err){
    res.status(500).send("User not saved");
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


