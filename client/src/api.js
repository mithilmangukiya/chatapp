const API_BASE = 'http://localhost:3000';

export const apiCall = async (method, url, token, data = null) => {
    const options = {
        method,
        headers: {
            ...(token ? {Authorization: `Bearer ${token}`} : {})
        },
    }

    if (data && !(data instanceof FormData)) {
        options.headers['Content-Type'] = 'application/json'
        options.body = JSON.stringify(data)
    } else if (data instanceof FormData) {
        options.body = data
    }

    const res = await fetch(`${API_BASE}${url}`, options)
    if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.message || 'API error')
    }
    return res.json()
}