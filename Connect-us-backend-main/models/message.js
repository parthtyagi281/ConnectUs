const mongoose=require("mongoose");

const messageSchema=new mongoose.Schema({
    text:{
        type:String
    },
    conversationId:{
        type:String
    },
    sender:{
        type:String
    }
},{timestamps:true})


const Message=mongoose.model("Message",messageSchema);

module.exports= Message;