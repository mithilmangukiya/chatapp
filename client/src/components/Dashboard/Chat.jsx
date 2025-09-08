import React, { useEffect, useState, useContext, useRef } from 'react'
import { AuthContext } from '../../App'
import { apiCall } from '../../api'
import { io } from 'socket.io-client'

const API_BASE = 'http://localhost:3000' 

const ChatWindow = ({ conversationId, receiverId, receiverUsername, goBack }) => {
    const { token, user } = useContext(AuthContext)
    const [messages, setMessages] = useState([])
    const [text, setText] = useState('')
    const [file, setFile] = useState(null)
    const socketRef = useRef(null)
    const messagesEndRef = useRef(null)

    useEffect(() => {
        if (!token) return
        loadMessages()
    }, [conversationId, token])

    useEffect(() => {
        if (!token) return
        socketRef.current = io(API_BASE, { auth: { token } })

        socketRef.current.on('receive message', message => {
            if (message.conversationId === conversationId) {
                setMessages(prev => [...prev, message])
            }
        })

        return () => {
            socketRef.current.disconnect()
        }
    }, [conversationId, token])

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const loadMessages = async () => {
        if (!conversationId) {
            setMessages([])
            return
        }
        try {
            const data = await apiCall('GET', `/api/messages/getmessage/${conversationId}`, token)
            setMessages(data)
        } catch (err) {
            console.error(err)
        }
    }

    const sendMessage = async () => {
        if (!text.trim() && !file) return

        const formData = new FormData()
        formData.append('receiver', receiverId)
        if (conversationId) formData.append('conversationId', conversationId)
        if (text.trim()) formData.append('text', text.trim())
        if (file) formData.append('file', file)

        try {
            const res = await fetch(`${API_BASE}/api/messages/postmessage`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            })
            if (!res.ok) {
                const errData = await res.json()
                alert(errData.error || 'Message send failed')
                return
            }
            const message = await res.json()
            socketRef.current.emit('send message', {
                conversationId: message.conversationId,
                receiver: receiverId,
                text: message.text,
                mediaUrl: message.mediaUrl,
                mediaType: message.mediaType,
            })
            setText('')
            setFile(null)
        } catch (err) {
            console.error(err)
        }
    }

    const handleKeyPress = e => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const handleFileChange = e => {
        if (e.target.files.length > 0) {
            setFile(e.target.files[0])
        }
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center mb-4">
                <button onClick={goBack} className="mr-4 text-blue-600 hover:underline">
                    &larr; Back
                </button>
                <h3 className="text-xl font-bold">Chat with {receiverUsername}</h3>
            </div>
            <div className="flex-grow overflow-y-auto border rounded-lg p-4 mb-4 h-[400px] flex flex-col bg-gray-50">
                {messages.map(msg => (
                    <div
                        key={msg._id}
                        className={`mb-3 p-3 rounded-xl max-w-[75%] shadow-sm ${msg.sender === user.id
                                ? "bg-blue-600 text-white self-end ml-auto"
                                : "bg-white border text-gray-800 self-start"
                            }`}
                    >
                        {msg.text && <p className="break-words">{msg.text}</p>}
                        {msg.mediaUrl && (
                            <>
                                {msg.mediaType === "image" && (
                                    <img
                                        src={`${API_BASE}${msg.mediaUrl}`}
                                        alt="sent file"
                                        className="max-w-full rounded-lg mt-2"
                                    />
                                )}
                                {msg.mediaType === "video" && (
                                    <video controls className="max-w-full rounded-lg mt-2">
                                        <source src={`${API_BASE}${msg.mediaUrl}`} type={msg.mediaType} />
                                        Your browser does not support the video tag.
                                    </video>
                                )}
                            </>
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="flex items-center space-x-2">
                <textarea
                    placeholder="Type a message..."
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="flex-grow p-3 border rounded-lg resize-none h-16 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input type="file" onChange={handleFileChange} accept="image/*,video/*" />
                <button
                    onClick={sendMessage}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    Send
                </button>
            </div>
        </div>

    )
}

export default ChatWindow