// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
// import { endpoints } from '@/api/endpoint'
// import httpClient from '@/api/http-client'
// import { AxiosError } from 'axios'

// // Define the interface for company admin data
// export interface CompanyAdminData {
//     name: string;
//     email: string;
//     password: string;
//     moduleAccess: number[];
// }

// // Define the state interface
// export interface CompanyAdminState {
//     loading: boolean;
//     error: string | null;
//     currentAdmin: CompanyAdminData | null;
// }

// const initialState: CompanyAdminState = {
//     loading: false,
//     error: null,
//     currentAdmin: null
// }

// // Initial form data
// export const initialFormData: CompanyAdminData = {
//     name: '',
//     email: '',
//     password: '',
//     moduleAccess: []
// }

// // Create async thunk for company admin signup
// export const createCompanyAdmin = createAsyncThunk(
//     'companyAdmin/createCompanyAdmin',
//     async (adminData: CompanyAdminData, { rejectWithValue }) => {
//         try {
//             const { data } = await httpClient.post(
//                 endpoints.companyAdmin.create(),
//                 adminData
//             )
//             return data
//         } catch (error: any) {
//             const err = error as AxiosError<any>
//             return rejectWithValue(err.response?.data?.message)
//         }
//     }
// )

// // Create the slice
// const companyAdminSlice = createSlice({
//     name: 'companyAdmin',
//     initialState,
//     reducers: {
//         clearCurrentAdmin: (state) => {
//             state.currentAdmin = null
//         },
//         clearError: (state) => {
//             state.error = null
//         }
//     },
//     extraReducers: (builder) => {
//         builder
//             // Create Company Admin
//             .addCase(createCompanyAdmin.pending, (state) => {
//                 state.loading = true
//                 state.error = null
//             })
//             .addCase(createCompanyAdmin.fulfilled, (state, action) => {
//                 state.loading = false
//                 state.currentAdmin = action.payload
//             })
//             .addCase(createCompanyAdmin.rejected, (state, action) => {
//                 state.loading = false
//                 state.error = action.payload as string
//             })
//     }
// })

// export const { clearCurrentAdmin, clearError } = companyAdminSlice.actions
// export default companyAdminSlice.reducer


// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
// import { endpoints } from '@/api/endpoint'
// import httpClient from '@/api/http-client'
// import { AxiosError } from 'axios'

// // Define the interface for company admin data
// export interface CompanyAdminData {
//     name: string;
//     email: string;
//     password: string;
//     moduleAccess: number[];
// }

// // Define the state interface with added admins list
// export interface CompanyAdminState {
//     loading: boolean;
//     error: string | null;
//     currentAdmin: CompanyAdminData | null;
//     adminsList: CompanyAdminData[];
// }

// const initialState: CompanyAdminState = {
//     loading: false,
//     error: null,
//     currentAdmin: null,
//     adminsList: []
// }

// // Initial form data
// export const initialFormData: CompanyAdminData = {
//     name: '',
//     email: '',
//     password: '',
//     moduleAccess: []
// }

// // Create async thunk for company admin signup
// export const createCompanyAdmin = createAsyncThunk(
//     'companyAdmin/createCompanyAdmin',
//     async (adminData: CompanyAdminData, { rejectWithValue }) => {
//         try {
//             const { data } = await httpClient.post(
//                 endpoints.companyAdmin.create(),
//                 adminData
//             )
//             return data
//         } catch (error: any) {
//             const err = error as AxiosError<any>
//             return rejectWithValue(err.response?.data?.message)
//         }
//     }
// )

// // Create async thunk for fetching company admins list
// export const fetchCompanyAdmins = createAsyncThunk(
//     'companyAdmin/fetchCompanyAdmins',
//     async (_, { rejectWithValue }) => {
//         try {
//             const { data } = await httpClient.get(
//                 endpoints.companyAdmin.list()
//             )
//             return data
//         } catch (error: any) {
//             const err = error as AxiosError<any>
//             return rejectWithValue(err.response?.data?.message)
//         }
//     }
// )

// // Create the slice
// const companyAdminSlice = createSlice({
//     name: 'companyAdmin',
//     initialState,
//     reducers: {
//         clearCurrentAdmin: (state) => {
//             state.currentAdmin = null
//         },
//         clearError: (state) => {
//             state.error = null
//         },
//         clearAdminsList: (state) => {
//             state.adminsList = []
//         }
//     },
//     extraReducers: (builder) => {
//         builder
//             // Create Company Admin
//             .addCase(createCompanyAdmin.pending, (state) => {
//                 state.loading = true
//                 state.error = null
//             })
//             .addCase(createCompanyAdmin.fulfilled, (state, action) => {
//                 state.loading = false
//                 state.currentAdmin = action.payload
//                 // Optionally update the list with the new admin
//                 state.adminsList.push(action.payload)
//             })
//             .addCase(createCompanyAdmin.rejected, (state, action) => {
//                 state.loading = false
//                 state.error = action.payload as string
//             })
//             // Fetch Company Admins List
//             .addCase(fetchCompanyAdmins.pending, (state) => {
//                 state.loading = true
//                 state.error = null
//             })
//             .addCase(fetchCompanyAdmins.fulfilled, (state, action) => {
//                 state.loading = false
//                 state.adminsList = action.payload
//             })
//             .addCase(fetchCompanyAdmins.rejected, (state, action) => {
//                 state.loading = false
//                 state.error = action.payload as string
//             })
//     }
// })

// export const { clearCurrentAdmin, clearError, clearAdminsList } = companyAdminSlice.actions
// export default companyAdminSlice.reducer


import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { endpoints } from '@/api/endpoint'
import httpClient from '@/api/http-client'
import { AxiosError } from 'axios'

// Define the interface for company admin data
export interface CompanyAdminData {
    name: string;
    email: string;
    password: string;
    moduleAccess: number[];
}

// Define interface for update data
export interface AdminUpdateData {
    moduleAccess: number[];
}

// Define the state interface with added admins list
export interface CompanyAdminState {
    loading: boolean;
    error: string | null;
    currentAdmin: CompanyAdminData | null;
    adminsList: CompanyAdminData[];
}

const initialState: CompanyAdminState = {
    loading: false,
    error: null,
    currentAdmin: null,
    adminsList: []
}

// Initial form data
export const initialFormData: CompanyAdminData = {
    name: '',
    email: '',
    password: '',
    moduleAccess: []
}

// Create async thunk for company admin signup
export const createCompanyAdmin = createAsyncThunk(
    'companyAdmin/createCompanyAdmin',
    async (adminData: CompanyAdminData, { rejectWithValue }) => {
        try {
            const { data } = await httpClient.post(
                endpoints.companyAdmin.create(),
                adminData
            )
            return data
        } catch (error: any) {
            const err = error as AxiosError<any>
            return rejectWithValue(err.response?.data?.message)
        }
    }
)

// Create async thunk for fetching company admins list
export const fetchCompanyAdmins = createAsyncThunk(
    'companyAdmin/fetchCompanyAdmins',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await httpClient.get(
                endpoints.companyAdmin.list()
            )
            return data
        } catch (error: any) {
            const err = error as AxiosError<any>
            return rejectWithValue(err.response?.data?.message)
        }
    }
)

// Create async thunk for updating company admin module access
export const updateCompanyAdmin = createAsyncThunk(
    'companyAdmin/updateCompanyAdmin',
    async ({ 
        id, 
        moduleAccess,
        name,
        email,
        entityName,
        compliance_checklist,
        both_checklist,
        custom_checklist
    }: { 
        id: string | number;
        moduleAccess: number[];
        name: string;
        email: string;
        entityName: string;
        compliance_checklist?: boolean;
        both_checklist?: boolean;
        custom_checklist?: boolean;
    }, { rejectWithValue }) => {
        try {
            const { data } = await httpClient.put(
                endpoints.companyAdmin.update(id),
                { 
                    moduleAccess,
                    name,
                    email,
                    entityName,
                    compliance_checklist,
                    both_checklist,
                    custom_checklist
                }
            )
            return data
        } catch (error: any) {
            const err = error as AxiosError<any>
            return rejectWithValue(err.response?.data?.message)
        }
    }
)

// Create the slice
const companyAdminSlice = createSlice({
    name: 'companyAdmin',
    initialState,
    reducers: {
        clearCurrentAdmin: (state) => {
            state.currentAdmin = null
        },
        clearError: (state) => {
            state.error = null
        },
        clearAdminsList: (state) => {
            state.adminsList = []
        }
    },
    extraReducers: (builder) => {
        builder
            // Create Company Admin
            .addCase(createCompanyAdmin.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(createCompanyAdmin.fulfilled, (state, action) => {
                state.loading = false
                state.currentAdmin = action.payload
                // Optionally update the list with the new admin
                // state.adminsList.push(action.payload)
            })
            .addCase(createCompanyAdmin.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
            // Fetch Company Admins List
            .addCase(fetchCompanyAdmins.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchCompanyAdmins.fulfilled, (state, action) => {
                state.loading = false
                state.adminsList = action.payload
            })
            .addCase(fetchCompanyAdmins.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
            // Update Company Admin
            .addCase(updateCompanyAdmin.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(updateCompanyAdmin.fulfilled, (state, action) => {
                state.loading = false
                state.currentAdmin = action.payload
                // Update the admin in the list if it exists
                // const index = state.adminsList.findIndex(admin => admin.email === action.payload.email)
                // if (index !== -1) {
                //     state.adminsList[index] = {
                //         ...state.adminsList[index],
                //         moduleAccess: action.payload.moduleAccess
                //     }
                // }
            })
            .addCase(updateCompanyAdmin.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
    }
})

export const { clearCurrentAdmin, clearError, clearAdminsList } = companyAdminSlice.actions
export default companyAdminSlice.reducer