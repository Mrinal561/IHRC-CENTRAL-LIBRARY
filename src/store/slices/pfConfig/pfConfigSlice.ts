import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import httpClient from '@/api/http-client'
import { endpoints } from '@/api/endpoint'

export interface PFConfigData {
  id?: string
  payment_mode: 'online' | 'offline'
  pf_frequency: 'monthly' | 'half_yearly' | 'yearly' | 'quarterly'
  pt_payment_due_date: {
    first_date: string
    second_date?: string
    third_date?: string
    last_date?: string
  }
  state_id?: string
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
  async  ({ page, page_size }: { page: number, page_size: number }, { rejectWithValue }) => {
    try {
        const { data } = await httpClient.get(endpoints.pf.getAll(), {
            params: {
                page,
                page_size: page_size,
              },
        })
        return {
            data: data.data,
            paginateData: {
                totalResults: data.paginate_data.totalResults,
                totalPages: data.paginate_data.totalPages || 0,
                page: page, // Use the requested page number
                limit: page_size, 
            },
          };
    }
    catch(error: any) {
        // return rejectWithValue(error.response?.data.message)
    }
  }
)

export const createPFConfig = createAsyncThunk(
  'pfConfig/createPFConfig',
  async (pfConfigData: PFConfigData, { rejectWithValue }) => {
    try{

        const { data } = await httpClient.post(
            endpoints.pf.create(),
            pfConfigData
        )
        return data
    }
    catch(error: any){
        return rejectWithValue(error.response?.data.message || error.message)
    }
  }
)

export const updatePFConfig = createAsyncThunk(
  'pfConfig/updatePFConfig',
  async ({ id, data }: { id: string; data: PFConfigData }, { rejectWithValue }) => {
    try {
    const response = await httpClient.put(endpoints.pf.update(id), data)
    return response.data
  }
  catch (error: any) {
    return rejectWithValue(error.response?.data.message)
  }
}
)

export const fetchPFConfigById = createAsyncThunk(
  'pfConfig/fetchPFConfigById',
  async (id: string) => {
    const { data } = await httpClient.get(endpoints.pf.getById(id))
    return data
  }
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
        state.error = action.error.message || 'Failed to fetch PF configurations'
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
        state.error = action.error.message || 'Failed to create PF configuration'
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
            config.id === action.payload.id ? action.payload : config
          )
        }
      })
      .addCase(updatePFConfig.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to update PF configuration'
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
        state.error = action.error.message || 'Failed to fetch PF configuration'
      })
  },
})

export const { clearCurrentPFConfig, clearError } = pfConfigSlice.actions
export default pfConfigSlice.reducer