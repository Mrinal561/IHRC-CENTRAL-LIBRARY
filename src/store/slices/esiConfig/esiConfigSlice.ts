import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import httpClient from '@/api/http-client'
import { endpoints } from '@/api/endpoint'



export interface ESIConfigData {
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
  
  export interface ESIConfigState {
    esiConfigs: ESIConfigData[]
    loading: boolean
    error: string | null
    currentESIConfig: ESIConfigData | null
  }
  
  // Initial State
  const initialState: ESIConfigState = {
    esiConfigs: [],
    loading: false,
    error: null,
    currentESIConfig: null,
  }
  
  // Async Thunks
  export const fetchESIConfigs = createAsyncThunk(
    'esiConfig/fetchESIConfigs',
    async ({ page, page_size }: { page: number, page_size: number }, { rejectWithValue }) => {
      try {
        const { data } = await httpClient.get(endpoints.esi.getAll(), {
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
export const createESIConfig = createAsyncThunk(
    'esiConfig/create',
    async (data: ESIConfigData, { rejectWithValue }) => {
      try {
        const response = await httpClient.post(
          `${endpoints.esi.create()}/${data.state_id}`, 
          data
        );
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.response?.data || error.message);
      }
    }
  );
  
  export const updateESIConfig = createAsyncThunk(
    'esiConfig/updateESIConfig',
    async ({ id, data }: { id: string; data: ESIConfigData }, { rejectWithValue }) => {
      try {
        const response = await httpClient.put(endpoints.esi.update(id), data)
        return response.data
      }
      catch (error: any) {
        return rejectWithValue(error.response?.data.message)
      }
    }
  )
  
  export const fetchESIConfigById = createAsyncThunk(
    'esiConfig/fetchESIConfigById',
    async (id: string, { rejectWithValue }) => {
      try {
        const { data } = await httpClient.get(endpoints.esi.getById(id))
        return data
      }
      catch (error: any) {
        return rejectWithValue(error.response?.data.message)
      }
    }
  )
  
  // Slice
  const esiConfigSlice = createSlice({
    name: 'esiConfig',
    initialState,
    reducers: {
      clearCurrentESIConfig: (state) => {
        state.currentESIConfig = null
      },
      clearError: (state) => {
        state.error = null
      },
    },
    extraReducers: (builder) => {
      builder
        // Fetch All ESI Configs
        .addCase(fetchESIConfigs.pending, (state) => {
          state.loading = true
          state.error = null
        })
        .addCase(fetchESIConfigs.fulfilled, (state, action) => {
          state.loading = false
          state.esiConfigs = action.payload?.data || []
        })
        .addCase(fetchESIConfigs.rejected, (state, action) => {
          state.loading = false
          state.error = action.error.message || 'Failed to fetch ESI configurations'
        })
  
        // Create ESI Config
        .addCase(createESIConfig.pending, (state) => {
          state.loading = true
          state.error = null
        })
        .addCase(createESIConfig.fulfilled, (state, action) => {
          state.loading = false
          state.esiConfigs.push(action.payload)
        })
        .addCase(createESIConfig.rejected, (state, action) => {
          state.loading = false
          state.error = action.error.message || 'Failed to create ESI configuration'
        })
  
        // Update ESI Config
        .addCase(updateESIConfig.pending, (state) => {
          state.loading = true
          state.error = null
        })
        .addCase(updateESIConfig.fulfilled, (state, action) => {
          state.loading = false
          if (action.payload) {
            state.esiConfigs = state.esiConfigs.map((config) =>
              config.id === action.payload.id ? action.payload : config
            )
          }
        })
        .addCase(updateESIConfig.rejected, (state, action) => {
          state.loading = false
          state.error = action.error.message || 'Failed to update ESI configuration'
        })
  
        // Fetch ESI Config by ID
        .addCase(fetchESIConfigById.pending, (state) => {
          state.loading = true
          state.error = null
        })
        .addCase(fetchESIConfigById.fulfilled, (state, action) => {
          state.loading = false
          state.currentESIConfig = action.payload
        })
        .addCase(fetchESIConfigById.rejected, (state, action) => {
          state.loading = false
          state.error = action.error.message || 'Failed to fetch ESI configuration'
        })
    },
  })
  
  export const { clearCurrentESIConfig, clearError } = esiConfigSlice.actions
  export default esiConfigSlice.reducer