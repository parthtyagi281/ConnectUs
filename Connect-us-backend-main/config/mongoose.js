const mongoose=require("mongoose");
require('dotenv').config();

const uri=process.env.MONGO_URL;

mongoose.connect(uri);

const db=mongoose.connection;

db.on("error",console.error.bind("Connection error"));
db.once('open',function(){
    console.log("Connection is made with DB very successfully");
});
