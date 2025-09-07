import React from 'react'
import { useContext } from 'react'
import { AuthContext } from '../../App'
import { useState } from 'react'
import { apiCall } from '../../api'

const Login = ({ switchToSignup }) => {
    const { setToken } = useContext(AuthContext)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleLogin = async () => {
        setError('')
        try {
            const data = await apiCall('POST', '/api/auth/login', null, { username, password })
            setToken(data.token)
        } catch (error) {
            setError(error.message)
        }
    }
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">Login</h2>
            {error && <p className="text-red-600 mb-2 text-center">{error}</p>}
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full p-3 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                onClick={handleLogin}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
            >
                Login
            </button>
            <p className="mt-4 text-center text-gray-700">
                Don’t have an account?{" "}
                <button onClick={switchToSignup} className="text-blue-600 font-semibold hover:underline">
                    Sign up
                </button>
            </p>
        </div>

    )
}

export default Login