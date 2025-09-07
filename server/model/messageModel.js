import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conservation', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, default: '' },
    mediaUrl: { type: String, default: null},
    mediaType: { type: String, enum: ['image', 'video', 'file', null], default: null}
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);

export default Message