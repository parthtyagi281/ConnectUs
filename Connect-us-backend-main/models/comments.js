const mongoose = require("mongoose");

const commentSchema=new mongoose.Schema({
    text:{
        type:String
    },
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post"
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
})

const Comments= mongoose.model("Comments",commentSchema);

module.exports = Comments;