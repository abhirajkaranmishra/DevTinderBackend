const express = require("express");
const app = express();
const connectDB = require("./config/database.js");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth.js");
const profileRouter = require("./routes/profile.js");
const requestRouter = require("./routes/request.js")
const cors = require("cors");

app.use(cors({origin: "http://localhost:5173",
  credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);

connectDB().then(()=>{
  console.log("Database connected successfully");
  app.listen(3000, ()=>{
  console.log("Application listening on port number 3000");
})
})
.catch((err)=>{
  console.err("Database not connected successfully");
})
