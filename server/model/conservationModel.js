import mongoose from "mongoose";

const conservationSchema = new mongoose.Schema({
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    updatedAt: { type: Date, default: Date.now}
});

conservationSchema.index({ participants: 1})

const Conservation = mongoose.model('Conservation', conservationSchema);

export default Conservation