const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt=require("jsonwebtoken")

// register
router.post("/register", async (req, res) => {
    try {

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const user=await User.findOne({
            email:req.body.email
        });

        if(user)
        {
            res.status(404).json({status:404,success:false,message:"email is already in use"});
            return ;
        }
        else
        {
            const newUser= new User({
                name:req.body.name,
                email:req.body.email,
                password:hashedPassword
            });

            newUser.save();
            res.status(200).json({success:true,message:"user is created successfully"});
            return ;
        }


    } catch (err) {
        console.log(err);
    }
})


// login
router.post("/login",async (req,res)=>{
    try{
        const user=await User.findOne({email:req.body.email}).populate({
            path: "followers",
        }).populate({
            path: "following",
        });
        if(!user)
        {
            res.status(404).json({success:false,message:"user not found"});
            return ;
        }

        const validPassowrd=await bcrypt.compare(req.body.password,user.password);
        if(!validPassowrd)
        {
            res.status(400).json({success:false,message:"Incorrect credentials"});
            return ;
        }

        const tokenData={
            id:user._id,
        }
        const token=jwt.sign(tokenData,`${process.env.TOKEN_SECRET}`);
        res.status(200).json({success:true,token:token,user});

    }catch(error){
        console.log(error);
       res.status(500).json({success:false,error:error,status:500});
    }
})



module.exports = router;