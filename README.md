# Real-Time Chat Application

## Setup

### Backend
1. Clone repo and navigate to `server/`
2. Create `.env` file with:   PORT = 3000
MONGO_URL = mongodb+srv://mithil:mithil1234@cluster0.w4s0vrp.mongodb.net/chat_appliocation
SECRET_KEY = mithil
3. Install dependencies: npm install
4. Start server: npm run server

### Frontend
1. Navigate to `client/`
2. Install dependencies: npm install
3. Start React app: npm run dev

## Features
- User signup/login with JWT authentication
- Search users by username
- Start new conversations
- View past conversations
- Real-time messaging with Socket.IO
- Protected routes for authenticated users

Open two different browsers or devices
Example: open in two Google Chrome or one Google Chrome and Firefox

Login with two different accounts
User A → Login / Signup as user1
User B → Login / Signup as user2

Start a conversation
From user1, search for user2 and send a message.
You should see the message appear instantly on user2’s chat window (without refreshing).
Try sending messages, images, or videos both ways.
