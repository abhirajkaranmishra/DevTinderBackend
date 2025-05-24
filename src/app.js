const express = require("express");
const app = express();

app.use("/user",(req,res)=>{
  res.send("Hello World");
})
app.listen(3000,()=>{
  console.log("Hello World");
})