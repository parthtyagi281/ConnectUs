const router = require("express").Router();
const Conversation = require("../models/conversation.js");
const fetchUser = require("../middleware/fetchuser");

// creating the conversation
router.post("/", fetchUser, async (req, res) => {
    try {
        const conversation = await Conversation.findOne({
            members: { $all: [req.body.senderId, req.body.recieverId] }
        })
        if (conversation) {
            res.status(200).json({ success: true, message: "Conversation is already created" });
            return;
        }
        else {
            let newConversation = new Conversation({
                members: [req.body.senderId, req.body.recieverId]
            });
            const savedConversation = await newConversation.save();
            res.status(200).json({ success: true, conversation: savedConversation });
        }
    } catch (error) {
        res.json({ success: false, message: error });
    }
})


// get conversations of user
router.get("/:id", async (req, res) => {
    try {

        const conversations = await Conversation.find({
            members: { $in: [req.params.id] }
        })
        res.status(200).json({ success: true, conversations: conversations });


    } catch (error) {
        res.json({ success: false, message: error });
    }
})

module.exports = router