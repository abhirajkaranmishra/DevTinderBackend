const userAuth = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const express = require("express");
const requestRouter = express.Router();
const User = require("../models/user")


requestRouter.post("/request/send/:status/:toUserId",userAuth, async (req,res)=>{
try{
   const fromUserId = req.user._id;
   const status = req.params.status;
   const toUserId = req.params.toUserId;
   const allowedStatus = ["interested", "ignore"];
   if(!allowedStatus.includes(status))
   {
    return res.status(400).json({message : status +" is invalid status type"})
   }

   const toUserExists = await User.findById(toUserId);
   if(!toUserExists)
   {
    res.status(400).json({message: "User not found"})
   }
   const existingConnectionReqest = await ConnectionRequest.findOne({$or:[
    {fromUserId,toUserId},
    {fromUserId:toUserId, toUserId:fromUserId}
   ]});

   if(existingConnectionReqest)
   {
    return res.status(400).json({message:"Connection Request Already exist"})
   }

    if(fromUserId.equals(toUserId))
  {
    throw new Error("cannot send connection request to self");
  }

   const connectionRequest =new ConnectionRequest({
    fromUserId,
    toUserId,
    status
   })

   const data = await connectionRequest.save();
   res.json({
    message:"Your choice Saved successfully",
    data
   })
}
catch(err){
  res.status(400).send("Error "+err.message);
}
});

module.exports = requestRouter;