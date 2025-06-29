const express = require("express");
const userAuth = require("../middleware/auth.js");
const validateEditProfileData = require("../utils/validate.js");

const profileRouter = express.Router();

profileRouter.get("/profile/view",userAuth,async (req,res)=>{
  try
  {
    res.send(req.user);
  }
  catch(err)
  {
    res.status(400).send("Error "+err.message);
  }
});

profileRouter.patch("/profile/edit",userAuth,async (req,res)=>{
     try{
      if(!validateEditProfileData(req))
      {
        throw new Error("Invalid Edit Request");
      }
      const loggedInUser = req.user;
      Object.keys(req.body).forEach((key)=>
        loggedInUser[key] = req.body[key]
      )
      await loggedInUser.save();
      res.send(loggedInUser.firstName +" your profile updated successfully");
     }
     catch(err){
      res.status(500).send("Error "+err.message);
     }
})

module.exports = profileRouter;