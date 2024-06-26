const nodemailer = require("nodemailer");
const router = require("express").Router();
const dotenv = require("dotenv");
const User=require("../models/user");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt")


dotenv.config({ path: "./vars/.env" });


router.post("/createUser",async (req,res)=>{
    try{
        const user=await User.findOne({email:req.body.email});
        if(user)
        {
            res.status(400).json({ success: false, message:"Email is already taken." });
            return;
        }
        const payload={
            name:req.body.name,
            email:req.body.email
        }
        const token = jwt.sign({user:payload},process.env.TOKEN_SECRET,{expiresIn:'1h'});
        const transporter = nodemailer.createTransport({
            host: "smtp-mail.outlook.com", // hostname
            secureConnection: false, // TLS requires secureConnection to be false
            port: 587, // port for secure SMTP
            tls: {
                ciphers: 'SSLv3'
            },
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const mailOptions = {
            from:`ConnectUs ${process.env.EMAIL}`,
            to:req.body.email,
            subject:"Create Password Request",
            text:req.body.name,
            html:`<h3>Hii ${req.body.name},</h3>
                    <div>Click on the given link to create the password. If you have not started it to create the password, then ignore it.</div>
                    <a href='https://connectus.vercel.app/setPassword/${token}'><h3> Click here</h3></a>
                    <h3>Best Regards</h3> 
                    <h4>ConnectUs Team</h4>`
        }

        transporter.sendMail(mailOptions,async function (error, info) {
            try {
                if (error) {
                    throw error;
                }
                res.status(200).json({success:true,message:"email sent"});
            } catch (err) {
                console.log(err.toString());
                res.status(400).json({success:false,message:err.toString()});
            }
        });

    }catch(error){
        res.status(400).json({ success: false, message: error.toString() });
        return;
    }
})


router.post("/acceptUser/:token",async (req,res)=>{
    const token=req.params.token;
    try{
        const data= jwt.verify(token,process.env.TOKEN_SECRET);
        const user=await User.findOne({email:data.user.email});
        if(user)
        {
            res.status(400).json({ success: false, error: error.toString(),message:"Link has been used already." });
            return;
        }
        else
        {
            const salt=await bcrypt.genSalt(10);
            const hashedPassword=await bcrypt.hash(req.body.password,salt);
            const u=new User({
                name:data.user.name,
                email:data.user.email,
                password:hashedPassword
            })
            await u.save();
            res.status(200).json({ success: true, message:"Account is created successfully." });
            return;
        }
    }catch(error)
    {
        res.status(400).json({ success: false, error: error.toString(),message:"Invalid url" });
        return;
    }
})



router.post("/password-generate-link",async (req, res) => {
    try {
        const user=await User.findOne({email:req.body.email});
        if(!user)
        {
            res.status(400).json({success:false,message:"Email is not found"});
            return ;
        }
        const token_data={
            id:user._id
        }
        const token=jwt.sign(token_data,process.env.TOKEN_SECRET);
        const transporter = nodemailer.createTransport({
            host: "smtp-mail.outlook.com", // hostname
            secureConnection: false, // TLS requires secureConnection to be false
            port: 587, // port for secure SMTP
            tls: {
                ciphers: 'SSLv3'
            },
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const mailOptions = {
            from:`ConnectUs ${process.env.EMAIL}`,
            to:req.body.email,
            subject:"Reset Password Request",
            text:user.name,
            html:`<h3>Hii ${user.name},</h3>
                    <div>Click on the given link to reset the password. If you have not started it to reset the password, then ignore it.</div>
                    <a href='https://connectus.vercel.app/reset-password/${token}'><h3> Click here</h3></a>
                    <h3>Best Regards</h3> 
                    <h4>ConnectUs Team</h4>`
        }

        transporter.sendMail(mailOptions,async function (error, info) {
            try {
                if (error) {
                    throw error;
                }
                res.status(200).json({success:true,message:"email sent"});
                const nu= await User.findByIdAndUpdate(user._id,{resetPassword:true});
            } catch (err) {
                console.log(err.toString());
                res.status(400).json({success:false,message:err.toString()});
            }
        });


    } catch (error) {
        res.status(400).json({ success: false, error: error });
        return;
    }
})


router.post("/set-new-password/:token",async (req,res)=>{
    const token = req.params.token;
    try{
        const data =jwt.verify(token,process.env.TOKEN_SECRET);
        const user=await User.findById(data.id);
        if(!user)
        {
            res.status(400).json({success: false,message:"Invalid Token"});
            return;
        }
        if(user.resetPassword===false)
        {
            res.status(400).json({success: false,message:"Link has been used already"});
            return;
        }
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(req.body.password,salt);
        const nu= await User.findByIdAndUpdate(user._id,{resetPassword:false,password:hashedPassword});
        res.status(200).json({success:true,message:"Password is updated successfully"});
        return ;

    }catch (error) {
        res.status(400).json({ success: false,message:"Invalid Token", error: error });
        return;
    }
})


router.post("/check-link/:token",async (req,res)=>{
    try{
        const token = req.params.token;
        const data =jwt.verify(token,process.env.TOKEN_SECRET);
        const user=await User.findById(data.id);
        if(!user)
        {
            res.status(400).json({success: false,message:"Invalid Token"});
            return;
        }
        if(user.resetPassword===false)
        {
            res.status(400).json({success: false,message:"Link has been used already."});
            return;
        }
        res.status(200).json({success:true,message:"Link is safe"});
    }catch(error)
    {
        res.status(400).json({ success: false,message:"Invalid Token", error: error });
        return;
    }
})

module.exports = router