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
        createStateDistrict: () => api('superadmin/state/config/state-district'),
        getStateDistrict: () => api('superadmin/state/config/list/state-districts'),
        downloadTemplate: () => api('superadmin/state/config/template/state-district'),
        bulkCreate: () => api('superadmin/state/config/statedistrict-bulk-upload'),
        downloadData: () => api('superadmin/state/config/export-state-district-data'),
        updateStateDistrict: () => api('superadmin/state/config/state-district/update')
    },
    district: {
        getAll: () => api('superadmin/district'),
        getAllDistrict: () => api('district'),        
        getById: (id: string) => api(`superadmin/district/${id}`),
        create: () => api('superadmin/district'),
        update: (id: string) => api(`superadmin/district/${id}`),
    },
     compliances: {
        complianceCategorizationsList: () => api('superadmin/compliance/compliance-categorizations'),
        complianceApplicabilityList: () => api('superadmin/compliance/compliance-applicabilities'),
        legislationActsList: () => api('superadmin/compliance/legislation-acts'),
        complianceTypeList: () => api('superadmin/compliance/compliance-types'),
        penaltyTypesList: () => api('superadmin/compliance/penalty-types'),
        functionList: () => api('superadmin/compliance/functions'),
        downloadTemplate: () => api('superadmin/compliance/template'),
        exportData: () => api('superadmin/compliance/export'),
        listCompliance: () => api('superadmin/compliance/'),
        createcomplianceCategorizations: () => api('superadmin/compliance/compliance-categorizations'),
        createcomplianceApplicability: () => api('superadmin/compliance/compliance-applicabilities'),
        createlegislationActs: () => api('superadmin/compliance/legislation-acts'),
        createcomplianceType: () => api('superadmin/compliance/compliance-types'),
        createpenaltyTypes: () => api('superadmin/compliance/penalty-types'),
        createfunctions: () => api('superadmin/compliance/functions'),
        createcompliance: () => api('superadmin/compliance/'),
        bulkUpload: () => api('superadmin/compliance/bulk-upload'),
        updatecompliance: (id: string) => api(`superadmin/compliance/${id}`),
        togglestatus: (id: string) => api(`superadmin/compliance/toggle-status/${id}`),
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
   externaluser: {
    template: () => api(`superadmin/externaluser/export-external-user-template`),
    list: () => api(`superadmin/externaluser/external-user`),
    delete: (id:any) => api(`superadmin/externaluser/external-user/${id}`),
    update:(id:any)=> api(`superadmin/externaluser/external-user/${id}`),
    create: (id:any) => api(`superadmin/externaluser/external-user`)
   },
   posh: {
    create: () => api('posh'),
    update: (id:any) => api(`posh/${id}`),
    bulkUpload: () => api('posh/bulk-upload'),
    downloadData: () => api('posh/export'),
    downloadTemplate: () => api('posh/template'),
    list: () => api('posh'),
    detail: (id: any) => api(`posh/${id}`)
   },
   return: {
    create: () => api('return-superadmin/create'),
    bulkUpload: () => api('return-superadmin/bulk-upload'),
    downloadData: () => api('return-superadmin/export'),
    downloadTemplate: () => api('return-superadmin/template'),
    list: () => api('/return-superadmin/'),
    detail: (id: any) => api(`return-superadmin//${id}`),
    returnList: () => api('return-superadmin/act-name'),
    statusToggle: (id: any, is_active: boolean) => api(`return-superadmin/toggle-status/${id}`),
    update: (id:any) => api(`return-superadmin/${id}`),
    createActName: () => api('return-superadmin/act-name'),
    listactname: () => api('return-superadmin/act-name')
   },
   register: {
    createRegister: () => api('register-superadmin'),
    listRegister: () => api('register-superadmin'),
    detailRegister: (id:any) => api(`register-superadmin/${id}`),
    updateRegister: (id:any) => api(`register-superadmin/${id}`),
    deleteRegister: (id:any) => api(`register-superadmin/${id}`),
    exportRegister: () => api('register-superadmin/export'),
    downloadDocumentRegister: (id:any) => api(`register-superadmin/download-document/${id}`)
   }
    

}
