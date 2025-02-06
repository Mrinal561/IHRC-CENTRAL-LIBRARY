import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import httpClient from '@/api/http-client'
import { endpoints } from '@/api/endpoint'



export interface LWFConfigData {
    id?: string
    frequency: 'monthly' | 'half_yearly' | 'yearly' | 'quarterly'
    payment_due_date: {
      first_date: string
      second_date?: string
      third_date?: string
      last_date?: string
    }
    payment_mode: 'online' | 'offline'
    active: boolean
    state_id?: string
  }
  
  export interface LWFConfigState {
    lwfConfigs: LWFConfigData[]
    loading: boolean
    error: string | null
    currentLWFConfig: LWFConfigData | null
  }
  
  // Initial State
  const initialState: LWFConfigState = {
    lwfConfigs: [],
    loading: false,
    error: null,
    currentLWFConfig: null,
  }
  
  // Async Thunks
  export const fetchLWFConfigs = createAsyncThunk(
    'lwfConfig/fetchLWFConfigs',
    async ({ page, page_size }: { page: number, page_size: number }, { rejectWithValue }) => {
      try {
        const { data } = await httpClient.get(endpoints.lwf.getAll(), {
          params: {
            page,
            page_size: page_size,
          },
        })
        return {
          data: data?.data,
          paginateData: {
            totalResults: data.paginate_data.totalResults,
            totalPages: data.paginate_data.totalPages || 0,
            page: page,
            limit: page_size,
          },
        };
      }
      catch (error: any) {
        return rejectWithValue(error.response?.data.message)
      }
    }
  )
  
  // In your API slice or thunk
export const createLWFConfig = createAsyncThunk(
    'lwfConfig/create',
    async (data: LWFConfigData, { rejectWithValue }) => {
      try {
        const response = await httpClient.post(
          `${endpoints.lwf.create()}/${data.state_id}`, 
          data
        );
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.response?.data || error.message);
      }
    }
  );
  
  export const updateLWFConfig = createAsyncThunk(
    'lwfConfig/updateLWFConfig',
    async ({ id, data }: { id: string; data: LWFConfigData }, { rejectWithValue }) => {
      try {
        const response = await httpClient.post(endpoints.lwf.update(id), data)
        return response.data
      }
      catch (error: any) {
        return rejectWithValue(error.response?.data.message)
      }
    }
  )
  
  export const fetchLWFConfigById = createAsyncThunk(
    'lwfConfig/fetchLWFConfigById',
    async (id: string, { rejectWithValue }) => {
      try {
        const { data } = await httpClient.get(endpoints.lwf.getById(id))
        return data
      }
      catch (error: any) {
        return rejectWithValue(error.response?.data.message)
      }
    }
  )
  
  // Slice
  const lwfConfigSlice = createSlice({
    name: 'lwfConfig',
    initialState,
    reducers: {
      clearCurrentLWFConfig: (state) => {
        state.currentLWFConfig = null
      },
      clearError: (state) => {
        state.error = null
      },
    },
    extraReducers: (builder) => {
      builder
        // Fetch All ESI Configs
        .addCase(fetchLWFConfigs.pending, (state) => {
          state.loading = true
          state.error = null
        })
        .addCase(fetchLWFConfigs.fulfilled, (state, action) => {
          state.loading = false
          state.lwfConfigs = action.payload?.data || []
        })
        .addCase(fetchLWFConfigs.rejected, (state, action) => {
          state.loading = false
          state.error = action.error.message || 'Failed to fetch ESI configurations'
        })
  
        // Create ESI Config
        .addCase(createLWFConfig.pending, (state) => {
          state.loading = true
          state.error = null
        })
        .addCase(createLWFConfig.fulfilled, (state, action) => {
          state.loading = false
          state.lwfConfigs.push(action.payload)
        })
        .addCase(createLWFConfig.rejected, (state, action) => {
          state.loading = false
          state.error = action.error.message || 'Failed to create ESI configuration'
        })
  
        // Update ESI Config
        .addCase(updateLWFConfig.pending, (state) => {
          state.loading = true
          state.error = null
        })
        .addCase(updateLWFConfig.fulfilled, (state, action) => {
          state.loading = false
          if (action.payload) {
            state.lwfConfigs = state.lwfConfigs.map((config) =>
              config.id === action.payload.id ? action.payload : config
            )
          }
        })
        .addCase(updateLWFConfig.rejected, (state, action) => {
          state.loading = false
          state.error = action.error.message || 'Failed to update ESI configuration'
        })
  
        // Fetch ESI Config by ID
        .addCase(fetchLWFConfigById.pending, (state) => {
          state.loading = true
          state.error = null
        })
        .addCase(fetchLWFConfigById.fulfilled, (state, action) => {
          state.loading = false
          state.currentLWFConfig = action.payload
        })
        .addCase(fetchLWFConfigById.rejected, (state, action) => {
          state.loading = false
          state.error = action.error.message || 'Failed to fetch ESI configuration'
        })
    },
  })
  
  export const { clearCurrentLWFConfig, clearError } = lwfConfigSlice.actions
  export default lwfConfigSlice.reducer