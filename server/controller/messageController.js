import Message from "../model/messageModel.js";
import Conversation from "../model/conservationModel.js";

export const getMessages = async (req, res) => {
    const messages = await Message.find({ conversationId: req.params.conversationId }).sort({ createdAt: 1 });
    return res.status(200).json(messages);
}

export const postMessage = async (req, res) => {
    const { conversationId, receiver, text } = req.body;
    let conversation = null;

    if (!conversationId) {
        conversation = new Conversation({
            participants: [req.user.id, receiver],
        });
        await conversation.save();
    } else {
        conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(400).json({ message: "Conversation not found" });
        }
    }

    let mediaUrl = null;
    let mediaType = null;
    if (req.file) {
        mediaUrl = `/uploads/${req.file.filename}`;
        const mime = req.file.mimetype;
        if (mime.startsWith("image")) mediaType = "image";
        else if (mime.startsWith("video")) mediaType = "video";
        else mediaType = "file";
    }

    const message = new Message({
        conversationId: conversation ? conversation._id : conversationId,
        sender: req.user.id,
        receiver,
        text,
        mediaUrl,
        mediaType,
    });

    await message.save();

    conversation.updatedAt = new Date();
    await conversation.save();

    return res.status(201).json(message);
};