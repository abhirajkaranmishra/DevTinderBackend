const express = require("express");
const userAuth = require("../middleware/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const userRouter = express.Router();

userRouter.get("/user/request/received",userAuth, async (req,res)=>{
   try{
     const loggedInUser = req.user;
     const toUserId = req.user._id;
     const connectionRequest = await ConnectionRequestModel.
     find({toUserId:toUserId,status:"interested"}).populate("fromUserId",["firstName","lastName","age","gender","about","photoURL","skills"]);
     res.json({message:"Here is your connection request",connectionRequest});
   }
   catch(err){
      res.status(400).send("Error: "+err.message)
   }
})

userRouter.get("/user/connections",userAuth,async (req,res)=>{
 try{
   const loggedInUser = req.user;
   const connections = await ConnectionRequestModel.find({$or:[
      {toUserId:loggedInUser._id,
         status:"accepted"
      },
      {fromUserId:loggedInUser._id,
         status:"accepted"
      }
   ]}).populate("fromUserId", ["firstName","lastName","age","gender","about","photoURL","skills"]).
   populate("toUserId",["firstName","lastName","age","gender","about","photoURL","skills"])

   const data = connections.map((row)=>{
      if(row.fromUserId._id.toString() === loggedInUser._id.toString())
      {
        return  row.toUserId;
      }
      return  row.fromUserId;
   })

   res.json({data})
 }
 catch(err){
   res.status(400).send(err.message)
 }
});



module.exports = userRouter;
