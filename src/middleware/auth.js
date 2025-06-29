const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

const userAuth = async (req,res,next)=>{
  try{
  const cookies = req.cookies;
  const {token} = cookies;
  if(!token)
  {
    return res.status(401).send("Please Login");
  }
  const decodedmessage = await jwt.verify(token,"Akshay@12345"); 
  const {_id} = decodedmessage;
  const user = await User.findById({_id});
  if(!user)
    throw new Error("No user found");
  req.user = user;
  next();
}
catch(err){
  res.status(500).send("Error "+err.message);
}
};

module.exports = userAuth;