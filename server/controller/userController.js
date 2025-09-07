import User from '../model/userModel.js';

export const searchUsers = async (req, res) => {
    const search = req.query.search || '';
    const regex = new RegExp(search, 'i');
    const users = await User.find({ username: regex, _id: {$ne: req.user.id}}).select('username');
    return res.status(200).json(users);
}