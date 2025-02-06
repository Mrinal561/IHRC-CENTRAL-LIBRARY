import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import httpClient from '@/api/http-client'
import { endpoints } from '@/api/endpoint'

// Interface definitions
export interface ExternalUserData {
  id?: string
  // Add other required fields based on your data structure
}

export interface ExternalUserState {
  externalUsers: ExternalUserData[]
  loading: boolean
  error: string | null
  currentExternalUser: ExternalUserData | null
}

// Initial State
const initialState: ExternalUserState = {
  externalUsers: [],
  loading: false,
  error: null,
  currentExternalUser: null,
}

// Async Thunks
export const fetchExternalUsers = createAsyncThunk(
  'externalUser/fetchExternalUsers',
  async ({ page, page_size }: { page: number, page_size: number }, { rejectWithValue }) => {
    try {
      const { data } = await httpClient.get(endpoints.externaluser.list(), {
        params: {
          page,
          page_size,
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
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data.message)
    }
  }
)

export const createExternalUser = createAsyncThunk(
  'externalUser/create',
  async (data: ExternalUserData, { rejectWithValue }) => {
    try {
      const response = await httpClient.post(endpoints.externaluser.create(data.id), data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const updateExternalUser = createAsyncThunk(
  'externalUser/update',
  async ({ id, data }: { id: string; data: ExternalUserData }, { rejectWithValue }) => {
    try {
      const response = await httpClient.put(endpoints.externaluser.update(id), data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data.message)
    }
  }
)

export const deleteExternalUser = createAsyncThunk(
  'externalUser/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await httpClient.delete(endpoints.externaluser.delete(id))
      return id
    } catch (error: any) {
      return rejectWithValue(error.response?.data.message)
    }
  }
)

export const exportTemplate = createAsyncThunk(
  'externalUser/exportTemplate',
  async (_, { rejectWithValue }) => {
    try {
      const response = await httpClient.get(endpoints.externaluser.template())
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data.message)
    }
  }
)

// Slice
const externalUserSlice = createSlice({
  name: 'externalUser',
  initialState,
  reducers: {
    clearCurrentExternalUser: (state) => {
      state.currentExternalUser = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch External Users
      .addCase(fetchExternalUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchExternalUsers.fulfilled, (state, action) => {
        state.loading = false
        state.externalUsers = action.payload?.data || []
      })
      .addCase(fetchExternalUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch external users'
      })

      // Create External User
      .addCase(createExternalUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createExternalUser.fulfilled, (state, action) => {
        state.loading = false
        state.externalUsers.push(action.payload)
      })
      .addCase(createExternalUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to create external user'
      })

      // Update External User
      .addCase(updateExternalUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateExternalUser.fulfilled, (state, action) => {
        state.loading = false
        if (action.payload) {
          state.externalUsers = state.externalUsers.map((user) =>
            user.id === action.payload.id ? action.payload : user
          )
        }
      })
      .addCase(updateExternalUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to update external user'
      })

      // Delete External User
      .addCase(deleteExternalUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteExternalUser.fulfilled, (state, action) => {
        state.loading = false
        state.externalUsers = state.externalUsers.filter(
          (user) => user.id !== action.payload
        )
      })
      .addCase(deleteExternalUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to delete external user'
      })

      // Export Template
      .addCase(exportTemplate.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(exportTemplate.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(exportTemplate.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to export template'
      })
  },
})

export const { clearCurrentExternalUser, clearError } = externalUserSlice.actions
export default externalUserSlice.reducer