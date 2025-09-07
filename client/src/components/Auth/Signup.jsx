import React from 'react'
import { useState } from 'react'
import { apiCall } from '../../api'

const Signup = ({ switchToLogin }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    const handleSignup = async () => {
        setError('')
        setMessage('')

        if (!username || !password || !confirmPassword) {
            setError('All fields are required')
            return
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters long')
            return
        }
        if (password !== confirmPassword) {
            setError('Password and Confirm Password do not match')
            return
        }

        try {
            await apiCall('POST', '/api/auth/register', null, { username, password, confirmPassword })
            setMessage('Signup successful! Please login.')
            setUsername('')
            setPassword('')
            setConfirmPassword('')
        } catch (error) {
            setError(error.message)
        }
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">Sign Up</h2>
            {error && <p className="text-red-600 mb-2 text-center">{error}</p>}
            {message && <p className="text-green-600 mb-2 text-center">{message}</p>}
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full p-3 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full p-3 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
                onClick={handleSignup}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-medium"
            >
                Sign Up
            </button>
            <p className="mt-4 text-center text-gray-700">
                Already have an account?{" "}
                <button onClick={switchToLogin} className="text-blue-600 font-semibold hover:underline">
                    Login
                </button>
            </p>
        </div>

    )
}

export default Signup