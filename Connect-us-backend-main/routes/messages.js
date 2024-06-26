const router = require("express").Router();
const Message = require("../models/message.js");
const fetchUser=require("../middleware/fetchuser");


//add a message
router.post("/",async (req,res)=>{
    try{
        const newMessage=  new Message({
                text:req.body.text,
                sender:req.body.sender,
                conversationId:req.body.conversationId
        });
        const savedMessage=await newMessage.save();
        res.status(200).json({success:true,message:savedMessage});

    }catch(error)
    {
        res.json({success:false,message:error});
    }
})


// get a message
router.get("/:id",async (req,res)=>{
    try{

        const messages=await Message.find({
            conversationId:req.params.id
        })
        res.status(200).json({success:true,messages:messages});

    }catch(error)
    {
        res.json({success:false,message:error});
    }
})


// delete a message
router.delete("/delete/message/:id",fetchUser,async (req,res)=>{
    try{
        let message= await Message.findById(req.params.id);
        await message.deleteOne();
        res.status(200).json({success:true,message:"message deleted successfully"});
        return ;
    }catch(err)
    {
        if(err)
        {
            res.json({success:false,message:err})
            return ;
        }
    }
})

module.exports=router