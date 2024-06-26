const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        min:3
    },
    email:{
        type:String,
        required:true,
        min:3,
        unique:true
    },
    password:{
        type:String,
        required:true,
        min:6,
    },
    followers:{
        type:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }]
    },
    following:{
        type:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }]
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    profilePicture:{
        type:String,
        default:""
    },
    desc:{
        type:String
    },
    coverPicture:{
        type:String,
        default:""
    },
    city:{
        type:String
    },
    from:{
        type:String
    },
    relationship:{
        type:String,
    },
    resetPassword:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})


const User=mongoose.model("User",userSchema);

module.exports= User;