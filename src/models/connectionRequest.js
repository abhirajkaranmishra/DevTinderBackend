const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
  fromUserId:
  {
    type: mongoose.Schema.Types.ObjectId,
    required:true,
    ref:"User"
  },
  toUserId:
  {
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:"User"
  },
  status:
  {
    type:String,
    enum : 
    {
      values:["ignored","accepted","rejected","interested"],
      message:`{VALUE} is incorrect datatype`,
    },
    required:true,
  }
},
{
  timestamps:true,
});
connectionRequestSchema.index({fromUserId:1,toUserId:1})

const ConnectionRequestModel = new mongoose.model("ConnectionRequest",connectionRequestSchema);

module.exports = ConnectionRequestModel;

