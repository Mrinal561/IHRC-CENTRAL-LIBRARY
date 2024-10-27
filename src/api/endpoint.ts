const api = (endpoint: string) =>
    `${import.meta.env.VITE_API_GATEWAY}${endpoint}`

export const endpoints = {
    auth: {
        login: () => api('superadmin/login'),
        refresh: () => api('superadmin/refresh'),
        signup: () => api('superadmin/signup'),
        logout: () => api('superadmin/logout'),
        profile: () => api('superadmin/profile'),
    },
    state: {
        getAll: () => api('superadmin/state'),
        getById: (id: string) => api(`superadmin/state/${id}`),
        create: () => api('superadmin/state'),
        update: (id: string) => api(`superadmin/state/${id}`),
        delete: (id: string) => api(`superadmin/state/${id}`),
    },
    district: {
        getAll: () => api('superadmin/district'),
        getById: (id: string) => api(`superadmin/district/${id}`),
        create: () => api('superadmin/district'),
        update: (id: string) => api(`superadmin/district/${id}`),
        delete: (id: string) => api(`superadmin/district/${id}`)
    },
    compliances: {
        getAll: () => api('superadmin/compliance'),
        getById: (id: string) => api(`superadmin/compliance/${id}`),
        create: () => api('superadmin/compliance'),
        update: (id: string) => api(`superadmin/compliance/${id}`),
        delete: (id: string) => api(`superadmin/compliance/${id}`)
    }

    

}
