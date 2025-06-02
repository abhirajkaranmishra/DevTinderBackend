const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
     firstName:{
         type:String,
         required:true,
         minLength:2,
         maxLength:20,
         trim:true
     },
     lastName:{
          type:String,
          minLength:2,
          trim:true
     },
     emailId:{
         type:String,
         required:true,
         maxLength:50,
         minLength:12,
         unique:true,
         lowercase: true,
         trim:true,
         validate(value){
          if(!validator.isEmail(value))
               throw new Error("Invalid Email Address:"+value)
         }
     },
     password:{
          type:String,
          required:true,
          trim:true,
          validate(value){
          if(!validator.isStrongPassword(value))
               throw new Error("Enter a strong password:"+value);
         }
     },
     age:{
          type:Number,
          min:10,
          trim:true
     },
     gender:{
         type:String,
         trim:true,
         validate(value)
         {
          if(!["male","female","Others"].includes(value))
               throw new Error("Gender not valid");
         }
     },
     photoUrl:{
          type:String,
          trim:true,
          default:"https://img.pikbest.com/origin/10/37/43/29tpIkbEsTxhN.png!bw700",
          validate(value){
          if(!validator.isURL(value))
               throw new Error("Invalid URL:"+value)
         }
     },
     about:{
          type:String,
          default:" I am Tech Enthusiast",
          trim:true,
          maxLength:100
     },
     skills:{
         type:[String]
     }
},{
     timestamps: true,
});
userSchema.index({ emailId: 1 });

const User = mongoose.model("User",userSchema);

module.exports = User;