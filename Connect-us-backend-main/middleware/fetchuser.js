const jwt = require("jsonwebtoken");
const User = require("../models/user");


const fetchuser = async (req, res, next) => {
    const token = req.header('auth-token');

    if (!token) {
        res.status(401).json({ success: false, message: "invalid token" });
        return;
    }

    try {
        const data = jwt.verify(token, process.env.TOKEN_SECRET);
        const userId = data.id;
        const user = await User.findById(userId);
        req.user = user;
        next();
    }catch(error)
    {
        res.status(500).json({ success: false, message: "token expired" });
        return ;
    }

    

}

module.exports = fetchuser;