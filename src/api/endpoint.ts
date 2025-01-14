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
    },
    district: {
        getAll: () => api('superadmin/district'),
        getById: (id: string) => api(`superadmin/district/${id}`),
        create: () => api('superadmin/district'),
        update: (id: string) => api(`superadmin/district/${id}`),
    },
    compliances: {
        getAll: () => api('superadmin/compliance'),
        getById: (id: string) => api(`superadmin/compliance/${id}`),
        create: () => api('superadmin/compliance'),
        update: (id: string) => api(`superadmin/compliance/${id}`),
        downloadFormat: () => api(`upload/sample_files/master-compliance.xlsx`),
        bulkCreate: () => api(`/superadmin/compliance/bulk-upload`),
        delete: (id: string) => api(`superadmin/compliance/${id}`),
    },
    pf: {
        getAll: () => api('superadmin/pfconfig'),
        getById: (id: string) => api(`superadmin/pfconfig/${id}`),
        create: () => api('superadmin/pfconfig'),
        update: (id: string) => api(`superadmin/pfconfig/${id}`),
    },
    esi: {
        getAll: () => api('superadmin/state/config'),
        getById: (id: string) => api(`superadmin/state/config/esi/${id}`),
        create: () => api('superadmin/state/config/esi'),
        update: (id: string) => api(`superadmin/state/config/esi/${id}`),
      },
      esiConfig:{
        detail: (id:any) => api(`superadmin/esiconfig/${id}`),
        update: (id:any) => api(`superadmin/esiconfig/${id}`)
      },
    lwf: {
        getAll: () => api('superadmin/state/config'),
        getById: (id: string) => api(`superadmin/state/config/lwf/${id}`),
        create: () => api('superadmin/state/config/lwf'),
        update: (id: string) => api(`superadmin/state/config/lwf/${id}`),
      },
    pt: {
        getAll: () => api('superadmin/state/config'),
        getById: (id: string) => api(`superadmin/state/config/pt/${id}`),
        create: () => api('superadmin/state/config/pt'),
        update: (id: string) => api(`superadmin/state/config/pt/${id}`),
    },
    common: {
        getStatesAll: () => api('/states'),
        detail:(id:any)=> api(`superadmin/state/config/${id}`)
    },
    role:{
        list:() =>  api('superadmin/role')
    },
    module:{
        list:()=> api('superadmin/modules')
    },
    companyAdmin:{
        create:()=> api('companyadmin/signup'),
        list:()=> api(`/companyadmin/list`),
        update:(id:any)=> api(`/companyadmin/${id}`)
    },
    companyGroup: {
        getAll: () => api('companyadmin/company-group'),
        getById: (id: string) => api(`companyadmin/company-group/${id}`),
        create: () => api('companyadmin/company-group'),
        update: (id: string) => api(`companyadmin/company-group/${id}`),
        delete: (id: string) => api(`companyadmin/company-group/${id}`),
    },

    

}
