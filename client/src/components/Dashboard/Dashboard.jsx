import React from 'react'
import { useContext } from 'react'
import { useState } from 'react'
import { AuthContext } from '../../App'
import ConversationList from './ConversationList'
import SearchUsers from './SearchUsers'
import Chat from './Chat'

const Dashboard = () => {

    const [activeView, setActiveView] = useState('search')
    const [currentChat, setCurrentChat] = useState(null)
    const { logout } = useContext(AuthContext)

    const openChat = (conversationId, receiverId, receiverUsername) => {
        setCurrentChat({ conversationId, receiverId, receiverUsername })
        setActiveView('chat')
    }
    return (
        <div className="bg-white p-6 rounded-xl shadow-md mt-4 flex flex-col md:flex-row max-w-6xl mx-auto min-h-[600px]">
            <div className="w-full md:w-1/3 flex flex-col mb-6 md:mb-0 md:pr-4 border-b md:border-b-0 md:border-r">
                <div className="mb-4 flex justify-between items-center">
                    <h3 className="text-xl font-bold">Conversations</h3>
                    <button
                        onClick={logout}
                        className="text-red-600 font-medium hover:underline"
                        title="Logout"
                    >
                        Logout
                    </button>
                </div>
                <ConversationList openChat={openChat} />
            </div>
            <div className="flex-1 md:ml-4 flex flex-col">
                {activeView === "search" && <SearchUsers openChat={openChat} />}
                {activeView === "chat" && currentChat && (
                    <Chat
                        conversationId={currentChat.conversationId}
                        receiverId={currentChat.receiverId}
                        receiverUsername={currentChat.receiverUsername}
                        goBack={() => setActiveView("search")}
                    />
                )}
            </div>
        </div>

    )
}

export default Dashboard