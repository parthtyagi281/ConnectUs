const bcrypt = require("bcrypt");
const fetchuser = require("../middleware/fetchuser");
const router = require("express").Router();
const User = require("../models/user");

// update the user
router.put("/update/:id", fetchuser, async (req, res) => {
  if (req.user.id === req.params.id) {
    try {
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      }
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: "internal server error" });
      return;
    }
    try {
      const user = await User.findByIdAndUpdate(req.user.id, req.body);
      const savedUser = await User.findById(req.user.id)
        .populate({
          path: "followers",
        })
        .populate({
          path: "following",
        });
      res
        .status(200)
        .json({
          success: true,
          message: "successfully updated",
          user: savedUser,
        });
      return;
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: "internal server error" });
      return;
    }
  } else {
    res
      .status(401)
      .json({ success: "false", message: "you can update only your account!" });
    return;
  }
});

//update password
router.put("/reset-password", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res
        .status(404)
        .json({ status: 404, success: false, message: "User does not exist!" });
    } else {
      const newUser = await User.findByIdAndUpdate(user._id, req.body);
      res.status(200).json({ success: true, message: "successfully updated" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "internal server error" });
  }
});

// delete the user
router.delete("/delete/:id", fetchuser, async (req, res) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.user.id);
      res.status(200).json({ success: true, message: "successfully deleted" });
      return;
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: "internal server error" });
    }
  } else {
    res
      .status(401)
      .json({ success: false, message: "you can delete only your account!" });
    return;
  }
});

// get user
router.get("/get-user-by-id/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    // to avoid password from sending
    const { password, ...other } = user._doc;
    res.status(200).json({
      success: true,
      message: "user is fetched successfully",
      user: other,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "internal server error" });
  }
});

router.get("/get-user-by-token", fetchuser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: "followers",
      })
      .populate({
        path: "following",
      });
    const { password, ...other } = user._doc;
    res.status(200).json({
      success: true,
      message: "user is fetched successfully",
      user: other,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "internal server error" });
  }
});

// follow a user
router.post("/:id/follow", fetchuser, async (req, res) => {
  if (req.params.id !== req.user.id) {
    try {
      const user = await User.findById(req.params.id);
      const currUser = await User.findById(req.user.id);
      if (!user.followers.includes(req.user.id)) {
        await User.findByIdAndUpdate(req.params.id, {
          $push: { followers: req.user.id },
        });
        await User.findByIdAndUpdate(req.user.id, {
          $push: { following: req.params.id },
        });
        res
          .status(200)
          .json({ success: true, message: "user is followed successully" });
      } else {
        res.status(403).json({
          success: false,
          message: "you are already following the user",
        });
        return;
      }
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: "internal server error" });
      return;
    }
  } else {
    res
      .status(403)
      .json({ success: false, message: "you can not follow your self" });
    return;
  }
});

// unfollow a user
router.post("/:id/unfollow", fetchuser, async (req, res) => {
  if (req.params.id !== req.user.id) {
    try {
      const user = await User.findById(req.params.id);
      const currUser = await User.findById(req.user.id);
      if (user.followers.includes(req.user.id)) {
        await User.findByIdAndUpdate(req.params.id, {
          $pull: { followers: req.user.id },
        });
        await User.findByIdAndUpdate(req.user.id, {
          $pull: { following: req.params.id },
        });
        res
          .status(200)
          .json({ success: true, message: "user is unfollowed successully" });
      } else {
        res.status(403).json({
          success: false,
          message: "you are  unfollowing the user already",
        });
        return;
      }
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: "internal server error" });
      return;
    }
  } else {
    res
      .status(403)
      .json({ success: false, message: "you can not unfollow your self" });
    return;
  }
});

// get friends
router.get("/friends/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const friends = await Promise.all(
      user.following.map((friend) => {
        return User.findById(friend);
      })
    );
    const friendList = [];
    friends.map((friend) => {
      const { _id, name, profilePicture } = friend;
      friendList.push({ _id, name, profilePicture });
    });
    res.status(200).json({ success: true, friendlist: friendList });
  } catch (error) {
    res.status(500).json({ success: false, message: "internal server error" });
    return;
  }
});

//search the users
router.get("/search-user/:name", fetchuser, async (req, res) => {
  try {
    let searchQuery = req.params.name.toLowerCase();
    if (searchQuery.trim() === "") {
      res.status(200).json({
        success: true,
        message: "Users are fetched successfully",
        users: [],
      });
      return;
    }

    let users = await User.find().select("_id name profilePicture");

    let result = [];

    for (let i = 0; i < users.length; i++) {
      let b = users[i].name.toLowerCase();
      let k = searchQuery.toLowerCase();
      if (b.includes(k)) {
        result.push(users[i]);
      }
    }

    res.status(200).json({
      success: true,
      message: "Users are fetched successfully",
      users: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
