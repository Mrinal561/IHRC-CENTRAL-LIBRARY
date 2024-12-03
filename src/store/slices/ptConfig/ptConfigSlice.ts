import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import httpClient from '@/api/http-client'
import { endpoints } from '@/api/endpoint'

// PT Configuration Data Type
export interface PTConfigData {
  ptec_frequency: 'monthly' | 'yearly' | 'half_yearly' | 'quarterly';
  ptrc_frequency: 'monthly' | 'yearly' | 'half_yearly' | 'quarterly';
  ptec_payment_due_date: {
    first_date: string;
    second_date: string;
    third_date: string;
    last_date: string;
  };
  ptrc_payment_due_date: {
    first_date: string;
    second_date: string;
    third_date: string;
    last_date: string;
  };
  ptec_payment_mode: 'online' | 'offline';
  ptrc_payment_mode: 'online' | 'offline';
  active: boolean;
  state_id?: string;
}

// Initial State Interface
export interface PTSetupState {
  ptConfigs: PTConfigData[];
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

// Fetch PT Configurations
export const fetchPTConfigs = createAsyncThunk(
  'ptConfig/fetchPTConfigs',
  async ({ page, page_size }: { page: number, page_size: number }, { rejectWithValue }) => {
    try {
      const { data } = await httpClient.get(endpoints.pt.getAll(), {
        params: {
          page,
          page_size: page_size,
        },
      });
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
);

// Create PT Configuration
export const createPTConfig = createAsyncThunk(
  'ptSetup/createPT',
  async (data: PTConfigData, { rejectWithValue }) => {
    try {
      const response = await httpClient.post(`${endpoints.pt.create()}/${data.state_id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// PT Setup Slice
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
      // Fetch Configurations
      .addCase(fetchPTConfigs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPTConfigs.fulfilled, (state, action) => {
        state.loading = false;
        state.ptConfigs = action.payload?.data || [];
      })
      .addCase(fetchPTConfigs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch PT configurations';
      })
      
      // Create Configuration
      .addCase(createPTConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createPTConfig.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createPTConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
  }
});

export const { resetPTSetupState } = ptSetupSlice.actions;
export default ptSetupSlice.reducer;