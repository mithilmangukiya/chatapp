import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import { connectDB } from './config.js'
import authRoutes from './routes/authRoutes.js'
import http from 'http'
import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'
import Message from './model/messageModel.js'
import Conversation from './model/conservationModel.js'
import path from 'path'
import { fileURLToPath } from 'url'
import userRoutes from './routes/userRoutes.js'
import conversationRoutes from './routes/conversationRoutes.js'
import messageRoutes from './routes/messageRouter.js'
import cors from 'cors'

const app = express()
const server = http.createServer(app)

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

const io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], allowedHeaders: ['Content-Type', 'Authorization'], }
})
app.use(express.json())

const PORT = process.env.PORT || 3000

connectDB()

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/conversations', conversationRoutes)

io.use((socket, next) => {
    const token = socket.handshake.auth.token
    if (!token) {
        return next(new Error("Authentication error"))
    }
    try {
        const user = jwt.verify(token, process.env.SECRET_KEY)
        socket.user = user
        next()
    }
    catch (err) {
        next(new Error('Authentication error'))
    }
})

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.user.username}`);

  socket.join(socket.user.id);

  socket.on("send message", async ({ conversationId, receiver, text, mediaUrl, mediaType }) => {
    let conversation = null;
    if (!conversationId) {
      conversation = new Conversation({
        participants: [socket.user.id, receiver],
      });
      await conversation.save();
    } else {
      conversation = await Conversation.findById(conversationId);
      if (!conversation) return;
    }

    const message = new Message({
      conversationId: conversation ? conversation._id : conversationId,
      sender: socket.user.id,
      receiver,
      text,
      mediaUrl: mediaUrl || null,
      mediaType: mediaType || null,
    });
    await message.save();

    conversation.updatedAt = Date.now();
    await conversation.save();

    io.to(receiver).emit("receive message", message);
    socket.emit("receive message", message);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.user.username}`);
  });
});


server.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})