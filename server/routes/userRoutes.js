import express from 'express'
import { authMiddlware } from '../middleware/authMiddleware.js';
import { searchUsers } from '../controller/userController.js';

const router = express.Router();

router.get('/searchUsers', authMiddlware, searchUsers)

export default router