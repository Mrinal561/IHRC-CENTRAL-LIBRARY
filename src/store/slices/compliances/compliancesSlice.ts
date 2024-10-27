// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { endpoints } from '@/api/endpoint';
// import httpClient from '@/api/http-client';

// export interface ComplianceData {
//   id: string;
//   legislation: string;
//   category: string;
//   penalty_type: string;
//   first_date: Date;
//   last_date: Date;
//   scheduled_frequency: string;
//   proof_mandatory: Boolean;
//   header: string;
//   description: string;
//   penalty_description: string;
//   applicablility: string;
//   bare_act_text: string;
//   type: string;
//   caluse: string;
//   frequency: string;
//   statutory_auth: string;
//   approval_required: boolean;
//   criticality: string;
// }

// export interface ComplianceState {
//   compliances: ComplianceData[];
//   loading: boolean;
//   error: string | null;
//   currentCompliance: ComplianceData | null;
// }

// const initialState: ComplianceState = {
//   compliances: [],
//   loading: false,
//   error: null,
//   currentCompliance: null,
// };

// // Async thunks for API calls
// export const fetchCompliances = createAsyncThunk(
//   'compliance/fetchCompliances',
//   async () => {
//     const { data } = await httpClient.get(endpoints.compliances.getAll());
//     return data;
//   }
// );

// export const createCompliance = createAsyncThunk(
//   'compliance/createCompliance',
//   async (complianceData: Omit<ComplianceData, 'id'>) => {
//     try {
//       const { data } = await httpClient.post(endpoints.compliances.create(), complianceData);
//       return data;
//     } catch (error: any) {
//     //   return rejectWithValue(error.response?.data?.message || 'Failed to create compliance');
//     }
//   }
// );

// export const updateCompliance = createAsyncThunk(
//   'compliance/updateCompliance',
//   async ({ id, data }: { id: string; data: Partial<ComplianceData> }, { rejectWithValue }) => {
//     try {
//       const response = await httpClient.put(endpoints.compliances.update(id), data);
//       return response.data;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to update compliance');
//     }
//   }
// );

// export const deleteCompliance = createAsyncThunk(
//   'compliance/deleteCompliance',
//   async (id: string, { rejectWithValue }) => {
//     try {
//       await httpClient.delete(endpoints.compliances.delete(id));
//       return id;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to delete compliance');
//     }
//   }
// );

// export const fetchComplianceById = createAsyncThunk(
//   'compliance/fetchComplianceById',
//   async (id: string, { rejectWithValue }) => {
//     try {
//       const { data } = await httpClient.get(endpoints.compliances.getById(id));
//       return data;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch compliance');
//     }
//   }
// );

// const complianceSlice = createSlice({
//   name: 'compliance',
//   initialState,
//   reducers: {
//     clearCurrentCompliance: (state) => {
//       state.currentCompliance = null;
//     },
//     clearError: (state) => {
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Fetch All Compliances
//       .addCase(fetchCompliances.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchCompliances.fulfilled, (state, action) => {
//         state.loading = false;
//         state.compliances = action.payload;
//       })
//       .addCase(fetchCompliances.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       // Create Compliance
//       .addCase(createCompliance.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(createCompliance.fulfilled, (state, action) => {
//         state.loading = false;
//         state.compliances.push(action.payload);
//       })
//       .addCase(createCompliance.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       // Update Compliance
//       .addCase(updateCompliance.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(updateCompliance.fulfilled, (state, action) => {
//         state.loading = false;
//         const index = state.compliances.findIndex((c) => c.id === action.payload.id);
//         if (index !== -1) {
//           state.compliances[index] = action.payload;
//         }
//       })
//       .addCase(updateCompliance.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       // Delete Compliance
//       .addCase(deleteCompliance.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(deleteCompliance.fulfilled, (state, action) => {
//         state.loading = false;
//         state.compliances = state.compliances.filter((c) => c.id !== action.payload);
//       })
//       .addCase(deleteCompliance.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       // Fetch Compliance by ID
//       .addCase(fetchComplianceById.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchComplianceById.fulfilled, (state, action) => {
//         state.loading = false;
//         state.currentCompliance = action.payload;
//       })
//       .addCase(fetchComplianceById.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// export const { clearCurrentCompliance, clearError } = complianceSlice.actions;
// export default complianceSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { endpoints } from '@/api/endpoint';
import httpClient from '@/api/http-client';

export interface ComplianceData {
  id: string;
  legislation: string;
  category: string;
  penalty_type: string;
  first_date: Date;
  last_date: Date;
  scheduled_frequency: string;
  proof_mandatory: Boolean;
  header: string;
  description: string;
  penalty_description: string;
  applicablility: string;
  bare_act_text: string;
  type: string;
  caluse: string;
  frequency: string;
  statutory_auth: string;
  approval_required: boolean;
  criticality: string;
}

export interface ComplianceState {
  compliances: ComplianceData[];
  loading: boolean;
  error: string | null;
  currentCompliance: ComplianceData | null;
}

const initialState: ComplianceState = {
  compliances: [],
  loading: false,
  error: null,
  currentCompliance: null,
};

// Async thunks for API calls
export const fetchCompliances = createAsyncThunk(
  'compliance/fetchCompliances',
  async () => {
    const { data } = await httpClient.get(endpoints.compliances.getAll());
    return data;
  }
);

export const createCompliance = createAsyncThunk(
  'compliance/createCompliance',
  async (complianceData: Omit<ComplianceData, 'id'>, { rejectWithValue }) => {
    try {
      const { data } = await httpClient.post(endpoints.compliances.create(), complianceData);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create compliance');
    }
  }
);

export const updateCompliance = createAsyncThunk(
  'compliance/updateCompliance',
  async ({ id, data }: { id: string; data: Partial<ComplianceData> }, { rejectWithValue }) => {
    try {
      const response = await httpClient.put(endpoints.compliances.update(id), data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update compliance');
    }
  }
);

export const deleteCompliance = createAsyncThunk(
  'compliance/deleteCompliance',
  async (id: string, { rejectWithValue }) => {
    try {
      await httpClient.delete(endpoints.compliances.delete(id));
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete compliance');
    }
  }
);

export const fetchComplianceById = createAsyncThunk(
  'compliance/fetchComplianceById',
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await httpClient.get(endpoints.compliances.getById(id));
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch compliance');
    }
  }
);

const complianceSlice = createSlice({
  name: 'compliance',
  initialState,
  reducers: {
    clearCurrentCompliance: (state) => {
      state.currentCompliance = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Compliances
      .addCase(fetchCompliances.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompliances.fulfilled, (state, action) => {
        state.loading = false;
        state.compliances = action.payload?.data || [];
      })
      .addCase(fetchCompliances.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Compliance
      .addCase(createCompliance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCompliance.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.compliances = [...state.compliances, action.payload];
        }
      })
      .addCase(createCompliance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Compliance
      .addCase(updateCompliance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCompliance.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.compliances = state.compliances.map((compliance) =>
            compliance.id === action.payload.id ? action.payload : compliance
          );
        }
      })
      .addCase(updateCompliance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete Compliance
      .addCase(deleteCompliance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCompliance.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.compliances = state.compliances.filter((c) => c.id !== action.payload);
        }
      })
      .addCase(deleteCompliance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Compliance by ID
      .addCase(fetchComplianceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComplianceById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCompliance = action.payload;
      })
      .addCase(fetchComplianceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentCompliance, clearError } = complianceSlice.actions;
export default complianceSlice.reducer;