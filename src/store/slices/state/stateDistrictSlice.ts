import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';

export interface StateDistrictPair {
  state_id: number;
  state_name: string;
  district_id: number;
  district_name: string;
}

export interface PaginationData {
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

export interface StateDistrictResponse {
  data: StateDistrictPair[];
  paginate_data: PaginationData;
}

interface StateDistrictState {
  stateDistricts: StateDistrictPair[];
  loading: boolean;
  error: string | null;
  pagination: PaginationData;
}

const initialState: StateDistrictState = {
  stateDistricts: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    totalPages: 0,
    totalResults: 0,
  },
};

export const fetchStateDistricts = createAsyncThunk(
  'state/fetchStateDistricts',
  async (query: {
    page?: number;
    page_size?: string;
  }, { rejectWithValue }) => {
    try {
      const response = await httpClient.get<StateDistrictResponse>(
        endpoints.state.getStateDistrict(),
        { params: query }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch state districts');
    }
  }
);

export const createState = createAsyncThunk(
  'state/createState',
  async (payload: { stateName: string; districtName: string }, { rejectWithValue }) => {
    try {
      const response = await httpClient.post(
        endpoints.state.createStateDistrict(),
        payload
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create state');
    }
  }
);

export const updateStateAndDistrict = createAsyncThunk(
  'state/updateStateAndDistrict',
  async (payload: {
    stateId: number;
    newStateName: string;
    districtId: number;
    newDistrictName: string;
  }, { rejectWithValue }) => {
    try {
      const response = await httpClient.put(
        endpoints.state.updateStateDistrict(),
        payload
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update state and district');
    }
  }
);

const stateDistrictSlice = createSlice({
  name: 'state',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch State Districts
      .addCase(fetchStateDistricts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStateDistricts.fulfilled, (state, action) => {
        state.loading = false;
        state.stateDistricts = action.payload.data;
        state.pagination = action.payload.paginate_data;
      })
      .addCase(fetchStateDistricts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create State
      .addCase(createState.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createState.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createState.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update State and District
      .addCase(updateStateAndDistrict.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStateAndDistrict.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateStateAndDistrict.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = stateDistrictSlice.actions;
export default stateDistrictSlice.reducer;