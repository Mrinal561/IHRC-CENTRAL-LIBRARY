// stateSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { endpoints } from '@/api/endpoint';
import httpClient from '@/api/http-client';


export interface StateData {
  id: string;
  name: string;
  ptec_frequency: string;
  ptrc_frequency: string;
  lwf_frequency: string;
  paymentFrequency: string;
  ptEcFirstDueDate: Date | null;
  ptEcLastDueDate: Date | null;
  ptRcFirstDueDate: Date | null;
  ptRcLastDueDate: Date | null;
  lwfFirstDueDate: Date | null;
  lwfLastDueDate: Date | null;
}

export interface StateState {
  states: StateData[];
  loading: boolean;
  error: string | null;
  currentState: StateData | null;
}

const initialState: StateState = {
  states: [],
  loading: false,
  error: null,
  currentState: null,
};

// Async thunks for API calls
export const fetchStates = createAsyncThunk(
  'state/fetchStates',
  async (param: any) => {
      const { data } = await httpClient.get(endpoints.state.getAll(), { 
        params: param,
      });
      return data;
  }
);

export const createState = createAsyncThunk(
  'state/createState',
  async (stateData: StateData) => {
      const { data } = await httpClient.post(endpoints.state.create(), stateData);
      return data;
    }
);

export const updateState = createAsyncThunk(
  'state/updateState',
  async ({ id, data }: { id: string; data: Partial<StateData> }, { rejectWithValue }) => {
    try {
      const response = await httpClient.put(endpoints.state.update(id), data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update state');
    }
  }
);



export const fetchStateById = createAsyncThunk(
  'state/fetchStateById',
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await httpClient.get(endpoints.state.getById(id));
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch state');
    }
  }
);

const stateSlice = createSlice({
  name: 'state',
  initialState,
  reducers: {
    clearCurrentState: (state) => {
      state.currentState = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All States
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
      // Create State
      .addCase(createState.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createState.fulfilled, (state, action) => {
        state.loading = false;
        state.states.push(action.payload);
      })
      .addCase(createState.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update State
      .addCase(updateState.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateState.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.states.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.states[index] = action.payload;
        }
      })
      .addCase(updateState.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch State by ID
      .addCase(fetchStateById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStateById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentState = action.payload;
      })
      .addCase(fetchStateById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentState, clearError } = stateSlice.actions;
export default stateSlice.reducer;