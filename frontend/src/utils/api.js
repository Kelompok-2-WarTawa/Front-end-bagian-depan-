// src/utils/api.js
//
// just for little while until our vps and domain set.
//
const BASE_URL = "https://wartawa.online/api";

export const apiRequest = async (endpoint, method = 'GET', body = null) => {
    // 1. Ambil Session
    const sessionString = localStorage.getItem('warTawaSession');
    const session = sessionString ? JSON.parse(sessionString) : null;
    const token = session?.token;

    // 2. Headers
    const headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // 3. Config
    const config = {
        method,
        headers,
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, config);

        // Handle response kosong (misal 204 No Content)
        if (response.status === 204) return null;

        const data = await response.json();

        if (!response.ok) {
            // Auto Logout HANYA jika token expired/invalid (401)
            if (response.status === 401) {
                console.warn("Token Expired/Invalid. Logout otomatis.");
                localStorage.removeItem('warTawaSession');
                window.location.href = '/login';
            }
            throw new Error(data.message || "Terjadi kesalahan pada server");
        }

        return data;
    } catch (error) {
        console.error(`API Error [${method} ${endpoint}]:`, error);
        throw error;
    }
};
