const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect("mongodb+srv://abhirajkaran484:LaMv6d8Bt8GWfDI1@developertinder.klfkxhm.mongodb.net/devTinder");
}

module.exports = connectDB;