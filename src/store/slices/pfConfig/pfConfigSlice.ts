import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { endpoints } from '@/api/endpoint'
import httpClient from '@/api/http-client'

// Types
export interface PFConfigData {
    id: string
    pf_frequency: 'monthly' | 'yearly' | 'half yearly'
    pt_payment_due_date: {
        first_date: string
        last_date: string | null
    }
}

export interface PFConfigState {
    pfConfigs: PFConfigData[]
    loading: boolean
    error: string | null
    currentPFConfig: PFConfigData | null
}

// Initial State
const initialState: PFConfigState = {
    pfConfigs: [],
    loading: false,
    error: null,
    currentPFConfig: null,
}

// Async Thunks
export const fetchPFConfigs = createAsyncThunk(
    'pfConfig/fetchPFConfigs',
    async (param: any) => {
        const { data } = await httpClient.get(endpoints.pf.getAll(), {
            params: param,
        })
        return data
    },
)

export const createPFConfig = createAsyncThunk(
    'pfConfig/createPFConfig',
    async (pfConfigData: PFConfigData) => {
        const { data } = await httpClient.post(
            endpoints.pf.create(),
            pfConfigData,
        )
        return data
    },
)

export const updatePFConfig = createAsyncThunk(
    'pfConfig/updatePFConfig',
    async ({ id, data }: { id: string; data: PFConfigData }) => {
        const response = await httpClient.put(endpoints.pf.update(id), data)
        return response.data
    },
)

export const fetchPFConfigById = createAsyncThunk(
    'pfConfig/fetchPFConfigById',
    async (id: string) => {
        const { data } = await httpClient.get(endpoints.pf.getById(id))
        return data
    },
)

// Slice
const pfConfigSlice = createSlice({
    name: 'pfConfig',
    initialState,
    reducers: {
        clearCurrentPFConfig: (state) => {
            state.currentPFConfig = null
        },
        clearError: (state) => {
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch All PF Configs
            .addCase(fetchPFConfigs.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchPFConfigs.fulfilled, (state, action) => {
                state.loading = false
                state.pfConfigs = action.payload?.data || []
            })
            .addCase(fetchPFConfigs.rejected, (state, action) => {
                state.loading = false
                state.error =
                    action.error.message || 'Failed to fetch PF configurations'
            })

            // Create PF Config
            .addCase(createPFConfig.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(createPFConfig.fulfilled, (state, action) => {
                state.loading = false
                state.pfConfigs.push(action.payload)
            })
            .addCase(createPFConfig.rejected, (state, action) => {
                state.loading = false
                state.error =
                    action.error.message || 'Failed to create PF configuration'
            })

            // Update PF Config
            .addCase(updatePFConfig.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(updatePFConfig.fulfilled, (state, action) => {
                state.loading = false
                if (action.payload) {
                    state.pfConfigs = state.pfConfigs.map((config) =>
                        config.id === action.payload.id
                            ? action.payload
                            : config,
                    )
                }
            })
            .addCase(updatePFConfig.rejected, (state, action) => {
                state.loading = false
                state.error =
                    action.error.message || 'Failed to update PF configuration'
            })

            // Fetch PF Config by ID
            .addCase(fetchPFConfigById.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchPFConfigById.fulfilled, (state, action) => {
                state.loading = false
                state.currentPFConfig = action.payload
            })
            .addCase(fetchPFConfigById.rejected, (state, action) => {
                state.loading = false
                state.error =
                    action.error.message || 'Failed to fetch PF configuration'
            })
    },
})

export const { clearCurrentPFConfig, clearError } = pfConfigSlice.actions
export default pfConfigSlice.reducer
