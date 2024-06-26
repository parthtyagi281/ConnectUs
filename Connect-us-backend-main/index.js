const express = require("express");
const app = express();
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
var cors = require('cors');
const multer = require("multer");
app.use(cors());

const path = require("path");

dotenv.config({ path: "./vars/.env" });

const db = require("./config/mongoose");

app.use("/images", express.static(path.join(__dirname, "./public/images")));

// middle ware
app.use(bodyParser.json());
app.use(helmet());
app.use(morgan("tiny"));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images')
    },
    filename: function (req, file, cb) {
        cb(null,req.body.name);
    }
})

const upload = multer({ storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
    try {
        return res.status(200).json({ success: true, message: "file uploaded successfully" });
    } catch (error) {
        console.log(error);
    }
})

app.put("/api/upload-profilePicture", upload.single("file"), (req, res) => {
    try {
        return res.status(200).json({ success: true, message: "file uploaded successfully" });
    } catch (error) {
        console.log(error);
    }
})

app.put("/api/upload-coverPicture", upload.single("file"), (req, res) => {
    try {
        return res.status(200).json({ success: true, message: "file uploaded successfully" });
    } catch (error) {
        console.log(error);
    }
})


// api call
app.use("/api/user", require("./routes/users"));
app.use("/api/user/auth", require("./routes/auth"));
app.use("/api/user/post", require("./routes/posts"));
app.use("/api/conversation",require("./routes/conversations"));
app.use("/api/message",require("./routes/messages"));
app.use("/api/auth-mail",require("./routes/auth_mail"));


app.listen(8000, (err) => {
    if (err) {
        console.log(`Error:${err}`)
    }
    else {
        console.log("Backend server is running!");
    }
})

