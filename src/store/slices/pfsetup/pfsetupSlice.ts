import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchPFSetups = createAsyncThunk(
  'pfSetup/fetchPFSetups',
  async (params = { page: 1, page_size: 10 }) => {
    const response = await axios.get('/api/pf-setups', { params });
    return response.data;
  }
);

export const createPFSetup = createAsyncThunk(
  'pfSetup/createPFSetup',
  async (data) => {
    const response = await axios.post('/api/pf-setups', data);
    return response.data;
  }
);

export const updatePFSetup = createAsyncThunk(
  'pfSetup/updatePFSetup',
  async ({ id, data }) => {
    const response = await axios.put(`/api/pf-setups/${id}`, data);
    return response.data;
  }
);

const pfsetupSlice = createSlice({
  name: 'pfSetup',
  initialState: {
    pfSetups: [],
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here
  }
});

export const { clearError } = pfsetupSlice.actions;
export default pfsetupSlice.reducer