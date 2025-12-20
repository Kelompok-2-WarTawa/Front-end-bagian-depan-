const BASE_URL = "https://api.wartawa.online/api";

export const apiRequest = async (endpoint, method = 'GET', body = null) => {
   
    const sessionString = localStorage.getItem('warTawaSession');
    const session = sessionString ? JSON.parse(sessionString) : null;
    const token = session?.token;

 
    const headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }


    const config = {
        method,
        headers,
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, config);

   
        if (response.status === 204) return null;

        const data = await response.json();

        if (!response.ok) {
         
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
