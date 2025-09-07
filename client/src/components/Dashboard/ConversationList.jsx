import React from 'react'
import { useContext } from 'react'
import { AuthContext } from '../../App'
import { useState } from 'react'
import { useEffect } from 'react'
import { apiCall } from '../../api'

const ConversationList = ({ openChat }) => {

    const { token, user } = useContext(AuthContext)
    const [conversations, setConversations] = useState([])

    useEffect(() => {
        if (token) {
            loadConversations()
        }
    }, [token])

    const loadConversations = async () => {
        try {
            const data = await apiCall('GET', '/api/conversations/conversations', token)
            setConversations(data)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        // <div className='w-1/3 border-r pr-4 overflow-y-auto'>
        //     <h3 className='text-xl font-bold mb-4'>Conversations</h3>
        //     {conversations.length === 0 && <p>No conversations yet.</p>}
        //     {conversations.map(conv => {
        //         const otherUser = conv.participants.find(p => p._id !== user.id)
        //         return (
        //             <div
        //             key={conv._id}
        //             className='p-2 border rounded mb-2 cursor-pointer hover:bg-gray-100'
        //             onClick={() => openChat(conv._id, otherUser ._id, otherUser .username)}
        //             >
        //                 {otherUser .username}
        //             </div>
        //         )
        //     })}
        // </div>


        <div className="overflow-y-auto">
            {conversations.length === 0 && (
                <p className="text-gray-500 text-center">No conversations yet.</p>
            )}
            {conversations.map(conv => {
                const otherUser = conv.participants.find(p => p._id !== user.id)
                return (
                    <div
                        key={conv._id}
                        className="p-3 border border-gray-200 rounded-lg mb-2 cursor-pointer hover:bg-gray-100 transition"
                        onClick={() => openChat(conv._id, otherUser._id, otherUser.username)}
                    >
                        <span className="font-medium">{otherUser.username}</span>
                    </div>
                )
            })}
        </div>

    )
}

export default ConversationList