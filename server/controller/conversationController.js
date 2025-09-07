import Conservation from "../model/conservationModel.js";

export const getConversations = async (req, res) => {
    const conversations = await Conservation.find({ participants: req.user.id })
    .sort({ updatedAt: -1 })
    .populate('participants', 'username');
    return res.status(200).json(conversations);
}