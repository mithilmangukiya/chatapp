import express from 'express'
import { getConversations } from '../controller/conversationController.js';
import {  authMiddlware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/conversations', authMiddlware, getConversations);

export default router