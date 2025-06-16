const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  firstName:{
    type:String,
    required:true,
    minLength:2,
    maxLength:50
  },
  lastName:{
    type:String,
    minLength:2,
    maxLength:50
  },
  emailId:{
    type:String,
    required:true,
    trim:true,
    lowercase:true,
    unique:true,
    minLength:12,
    maxLength:30,
    validate(value){
      if(!validator.isEmail(value))
        throw new Error ("EmailId not valid");
    }
  },
  password:{
    type:String,
    required:true,
    validate(value){
      if(!validator.isStrongPassword(value))
        throw new Error ("Enter Strong password");
    }
  },
  age:{
    type:Number,
    lowercase:true,
  },
  gender:{
    type:String,
    validate(value){
     if(!["male","female","others"].includes(value))
      throw new Error("Enter valid Gender")
    }
  },
  about:{
    type:String,
    default:"Hey! I am using this app"
  },
  photoURL:{
    type:String,
    validate(value){
      if(!validator.isURL(value))
        throw new Error ("Not valid Photo URL")
    }
  },
  skills:{
    type:[String]
  }
},{
  timestamps:true,
});

userSchema.methods.getJwtToken = async function(){
  const user = this;
  const token = await jwt.sign({_id:user._id},"Akshay@12345",{expiresIn:"1d"});
  return token;
}

userSchema.methods.validatePassword = async function(password){
  const user = this;
 const isPasswordValid = await bcrypt.compare(password,user.password,);
 return isPasswordValid;
}

const User = mongoose.model("User", userSchema);

module.exports = User;