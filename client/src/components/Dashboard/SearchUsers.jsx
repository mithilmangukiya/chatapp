import React from 'react'
import { useContext } from 'react'
import { AuthContext } from '../../App'
import { useState } from 'react'
import { apiCall } from '../../api'

const SearchUsers = ({ openChat }) => {

    const { token } = useContext(AuthContext)
    const [query, setQuery] = useState('')
    const [users, setUsers] = useState([])
    const [error, setError] = useState('')

    const searchUsers = async () => {
        setError('')
        if (!query.trim()) return
        try {
            const data = await apiCall('GET', `/api/users/searchUsers?search=${query}`, token)
            setUsers(data)
        } catch (error) {
            setError(error.message)
        }
    }
    return (
        // <div className='flex flex-col h-full'>
        //     <h3 className='text-xl font-bold mb-4'>Search Usera</h3>
        //     <div className='flex mb-4'>
        //         <input 
        //         type="text" 
        //         placeholder='Search by username'
        //         value={query}
        //         onChange={e => setQuery(e.target.value)}
        //         className='flex-grow p-2 border rounded-l'
        //         onKeyDown={e => e.key === 'Enter' && searchUsers()}
        //         />

        //         <button onClick={searchUsers} className='bg-blue-600 text-white px-4 rounded-r hover:bg-blue-700'>
        //             Search
        //         </button>
        //     </div>
        //     {error && <p className='text-red-600 mb-2'>{error}</p>}
        //     <div className='overflow-y-auto'>
        //         {users.length === 0 && <p>No users found.</p>}
        //         {users.map(user => (
        //             <div
        //             key={user._id}
        //             className='p-2 border rounded mb-2 cursor-pointer hover:bg-gray-100'
        //             onClick={() => openChat(null, user._id, user.username)}
        //             >
        //                 {user.username}
        //             </div>
        //         ))}
        //     </div>
        // </div>

        <div className="flex flex-col h-full">
            <h3 className="text-xl font-bold mb-4">Search Users</h3>
            <div className="flex mb-4">
                <input
                    type="text"
                    placeholder="Search by username"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    className="flex-grow p-3 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyDown={e => e.key === "Enter" && searchUsers()}
                />
                <button
                    onClick={searchUsers}
                    className="bg-blue-600 text-white px-4 rounded-r-lg hover:bg-blue-700 transition"
                >
                    Search
                </button>
            </div>
            {error && <p className="text-red-600 mb-2">{error}</p>}
            <div className="overflow-y-auto">
                {users.length === 0 && <p className="text-gray-500">No users found.</p>}
                {users.map(user => (
                    <div
                        key={user._id}
                        className="p-3 border rounded-lg mb-2 cursor-pointer hover:bg-gray-100 transition"
                        onClick={() => openChat(null, user._id, user.username)}
                    >
                        {user.username}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SearchUsers