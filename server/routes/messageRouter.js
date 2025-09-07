import express from 'express'
import { authMiddlware } from '../middleware/authMiddleware.js';
import { getMessages, postMessage } from '../controller/messageController.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/getmessage/:conversationId', authMiddlware, getMessages);
router.post('/postmessage', authMiddlware, upload.single('file'), postMessage);

export default router