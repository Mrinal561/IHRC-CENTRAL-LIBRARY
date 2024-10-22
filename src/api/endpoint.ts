const api = (endpoint: string) => 
    `${import.meta.env.VITE_API_GATEWAY}/${endpoint}`;


const endpoints = {
    auth: {
        login: () => api("superadmin/login"),
        refresh: () => api("superadmin/refresh"),
        signup: () => api("superadmin/signup"),
        logout: () => api("superadmin/logout"),
        profile: () => api("superadmin/profile"),
    }
}

export default endpoints;
