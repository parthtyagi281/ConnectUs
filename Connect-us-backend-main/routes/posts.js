const router = require("express").Router();
const Post = require("../models/post");
const fetchuser = require("../middleware/fetchuser");
const User = require("../models/user");
const Comments = require("../models/comments");

// create a post
router.post("/", fetchuser, async (req, res) => {
  const newPost = await new Post(req.body);
  try {
    let savedPost = await newPost.save();
    await savedPost.updateOne({ $set: { userId: req.user.id } });
    savedPost = await Post.findById(newPost.id).populate({
      path: "comments",
      populate: [
        {
          path: "user",
        },
      ],
      options: { sort: { createdAt: -1 } },
    });
    res
      .status(200)
      .json({
        success: true,
        message: "post is created successfully",
        post: savedPost,
      });
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
});

// update a post
router.put("/update/:id", fetchuser, async (req, res) => {
  const post = await Post.findById(req.params.id);
  try {
    if (post.userId === req.user.id) {
      await post.updateOne({ $set: req.body });
      res
        .status(200)
        .json({ success: true, message: "post is updated successfully" });
      return;
    } else {
      res
        .status(403)
        .json({
          success: false,
          message: "you can not update post of other people",
        });
      return;
    }
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: err, message: "post is not found" });
    return;
  }
});

// delete a post
router.delete("/delete/:id", fetchuser, async (req, res) => {
  const post = await Post.findById(req.params.id);
  try {
    if (post.userId === req.user.id) {
      await post.deleteOne();
      res
        .status(200)
        .json({ success: true, message: "post is deleted successfully" });
      return;
    } else {
      res
        .status(403)
        .json({
          success: false,
          message: "you can not delete post of other people",
        });
      return;
    }
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: err, message: "post is not found" });
    return;
  }
});

// get users post
router.get("/profile/:id", async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.params.id }).populate({
      path: "comments",
      populate: [
        {
          path: "user",
        },
      ],
      options: { sort: { createdAt: -1 } },
    });
    res.status(200).json({ success: true, posts: posts });
    return;
  } catch (err) {
    res.status(500).json({ success: false, error: err });
    return;
  }
});

// likes a post
router.put("/:id/like", fetchuser, async (req, res) => {
  const post = await Post.findById(req.params.id);
  try {
    if (!post.likes.includes(req.user.id)) {
      await post.updateOne({ $push: { likes: req.user.id } });
      res
        .status(200)
        .json({ success: true, message: "post is liked successfully" });
      return;
    } else {
      await post.updateOne({ $pull: { likes: req.user.id } });
      res
        .status(200)
        .json({ success: true, message: "post is disliked successfully" });
      return;
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
});

// get a post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate({
      path: "comments",
      populate: [
        {
          path: "user",
        },
      ],
      options: { sort: { createdAt: -1 } },
    });
    res.status(200).json({ success: true, post: post });
    return;
  } catch (err) {
    res.status(500).json({ success: false, error: err });
    return;
  }
});

// get all post
router.get("/timeline/all", fetchuser, async (req, res) => {
  try {
    const currUser = await User.findById(req.user.id);
    const userPosts = await Post.find({ userId: req.user.id }).populate({
      path: "comments",
      populate: [
        {
          path: "user",
        },
      ],
    });
    const friendsPosts = await Promise.all(
      currUser.following.map((friendId) => {
        return Post.find({ userId: friendId }).populate({
          path: "comments",
          populate: [
            {
              path: "user",
            },
          ],
          options: { sort: { createdAt: -1 } },
        });
      })
    );
    res
      .status(200)
      .json({ success: true, posts: userPosts.concat(...friendsPosts) });
    return;
  } catch (err) {
    res.status(500).json({ success: false, error: err });
    return;
  }
});

// get comments
router.get("/comments/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    let comments = await Comments.find({ post: postId }).populate("user");
    res.status(200).json({ comments: comments, success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: err });
    return;
  }
});

// add comments
router.post("/comments/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const { text, userId } = req.body;
    if (text.trim() === "") return;
    const comment = new Comments({
      text: text,
      user: userId,
      post: postId,
    });
    const savedComment = await comment.save();
    let post = await Post.findById(postId);
    const saved = await Comments.findById(savedComment._id).populate("user");
    post.comments.push(saved._id);
    await post.save();
    res.status(200).json({ comment: saved, success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: err });
    return;
  }
});

// delete comment
router.delete("/comments/:commentId", async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await Comments.findById(commentId);
    await Comments.findByIdAndDelete(commentId);
    let post = await Comments.findById(comment.post);
    for (let i = 0; i < post.comments.length; i++) {
      if (post.comments[i] === comment.post) {
        post.splice(i, 1);
        break;
      }
    }
    await post.save();
    res.status(200).json({ success: true, message: "deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: err });
    return;
  }
});

module.exports = router;
