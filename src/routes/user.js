const express = require("express");
const userAuth = require("../middleware/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");
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

userRouter.get("/feed",userAuth,async (req,res)=>{
   try{
     const loggedInUser = req.user;
     const page = parseInt(req.query.page) || 1;
     let limit = parseInt(req.query.limit) || 10;
     limit = limit>50?50:limit;
     const skip = (page-1)*limit;

     const connectionRequest = await ConnectionRequestModel.find({$or:[{fromUserId:loggedInUser._id},
      {toUserId:loggedInUser._id}]}).select("fromUserId toUserId")

     const hideUserFromFeed = new Set();

     connectionRequest.forEach((request) => {
      hideUserFromFeed.add(request.fromUserId.toString());
      hideUserFromFeed.add(request.toUserId.toString());
     });

     const user = await User.find({
      $and : [
         {_id:{$nin : Array.from(hideUserFromFeed)}},
         {_id:{$ne : loggedInUser._id}}
      ]
     }).select("firstName lastName age gender about photoURL skills").skip(skip).limit(limit);

     res.send(user);
   }
   catch(err){
     res.status(400).send("Error: "+err.message);
   }
})

module.exports = userRouter;
