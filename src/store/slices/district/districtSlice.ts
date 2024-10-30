
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { endpoints } from '@/api/endpoint';
import httpClient from '@/api/http-client';

export interface DistrictData {
  // id: string;
  name: string;
  state_id: number;
}

export interface DistrictState {
  districts: DistrictData[];
  states: DistrictData[];
  loading: boolean;
  error: string | null;
  currentDistrict: DistrictData | null;
}

const initialState: DistrictState = {
  districts: [],
  states: [],
  loading: false,
  error: null,
  currentDistrict: null,
};

// Async thunks for API calls
export const fetchStates = createAsyncThunk(
  'district/fetchStates',
  async () => {
    const { data } = await httpClient.get(endpoints.state.getAll());
    return data;
  }
);

export const fetchDistricts = createAsyncThunk(
  'district/fetchDistricts',
  async (param:any) => {
    const { data } = await httpClient.get(endpoints.district.getAll(),{
      params: param,
    });
    return data;
  }
);

export const createDistrict = createAsyncThunk(
  'district/createDistrict',
  async (districtData: DistrictData) => {
    const { data } = await httpClient.post(endpoints.district.create(), districtData);
    return data;
  }
);

export const updateDistrict = createAsyncThunk(
  'district/updateDistrict',
  async ({ id, data }: { id: string; data: DistrictData }) => {
    const response = await httpClient.put(endpoints.district.update(id), data);
    return response.data;
  }
);

export const fetchDistrictById = createAsyncThunk(
  'district/fetchDistrictById',
  async (id: string) => {
    const { data } = await httpClient.get(endpoints.district.getById(id));
    return data;
  }
);

const districtSlice = createSlice({
  name: 'district',
  initialState,
  reducers: {
    clearCurrentDistrict: (state) => {
      state.currentDistrict = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch States
      .addCase(fetchStates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStates.fulfilled, (state, action) => {
        state.loading = false;
        state.states = action.payload;
      })
      .addCase(fetchStates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Districts
      .addCase(fetchDistricts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDistricts.fulfilled, (state, action) => {
        state.loading = false;
        state.districts = action.payload;
      })
      .addCase(fetchDistricts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create District
      .addCase(createDistrict.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDistrict.fulfilled, (state, action) => {
        state.loading = false;
        // state.districts.push(action.payload);
      })
      .addCase(createDistrict.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update District
      .addCase(updateDistrict.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDistrict.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.districts.findIndex((d) => d.state_id === action.payload.id);
        if (index !== -1) {
          state.districts[index] = action.payload;
        }
      })
      .addCase(updateDistrict.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch District by ID
      .addCase(fetchDistrictById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDistrictById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDistrict = action.payload;
      })
      .addCase(fetchDistrictById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentDistrict, clearError } = districtSlice.actions;
export default districtSlice.reducer;
