import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import httpClient from '@/api/http-client'
import { endpoints } from '@/api/endpoint'
import { PTECConfigData, PTRCConfigData } from '@/@types/ptConfig';

// Initial State Interface
export interface PTSetupState {
  ptConfigs: PTECConfigData[]
  loading: boolean;
  error: string | null;
  success: boolean;
}

// Initial State
const initialState: PTSetupState = {
    ptConfigs: [],
  loading: false,
  error: null,
  success: false
};

export const fetchPTConfigs = createAsyncThunk(
    'ptConfig/fetchPTConfigs',
    async ({ page, page_size }: { page: number, page_size: number }, { rejectWithValue }) => {
      try {
        const { data } = await httpClient.get(endpoints.pt.getAll(), {
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

// Async Thunk for PTEC Creation
export const createPTECConfig = createAsyncThunk(
  'ptSetup/createPTEC',
  async (data: PTECConfigData, { rejectWithValue }) => {
    try {
      const response = await httpClient.post(`${endpoints.pt.pteccreate()}/${data.state_id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async Thunk for PTRC Creation
export const createPTRCConfig = createAsyncThunk(
  'ptSetup/createPTRC',
  async (data: PTRCConfigData, { rejectWithValue }) => {
    try {
      const response = await httpClient.post(`${endpoints.pt.ptrccreate()}/${data.state_id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create Slice
const ptSetupSlice = createSlice({
  name: 'ptSetup',
  initialState,
  reducers: {
    resetPTSetupState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder

    .addCase(fetchPTConfigs.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPTConfigs.fulfilled, (state, action) => {
        state.loading = false
        state.ptConfigs = action.payload?.data || []
      })
      .addCase(fetchPTConfigs.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch ESI configurations'
      })
    // PTEC Creation Reducers
    .addCase(createPTECConfig.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    })
    .addCase(createPTECConfig.fulfilled, (state) => {
      state.loading = false;
      state.success = true;
    })
    .addCase(createPTECConfig.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    })

    // PTRC Creation Reducers
    .addCase(createPTRCConfig.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    })
    .addCase(createPTRCConfig.fulfilled, (state) => {
      state.loading = false;
      state.success = true;
    })
    .addCase(createPTRCConfig.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    })
  }
});

export const { resetPTSetupState } = ptSetupSlice.actions;
export default ptSetupSlice.reducer;