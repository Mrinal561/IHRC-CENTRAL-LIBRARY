

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { endpoints } from '@/api/endpoint';
import httpClient from '@/api/http-client';
import { AxiosError } from 'axios';
import { toast, Notification } from '@/components/ui';

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

// const openNotification = (type: 'success' | 'info' | 'danger' | 'warning', message: string, error?: any) => {
//   let errorMessage = message;
//   // if (error && error.response && error.response.data && error.response.data.message) {
//   //   errorMessage = error.response.data.message.join(', ');
//   // }
//   toast.push(
//     <Notification title="Error" type={type}>
//       {errorMessage}
//     </Notification>
//   );
// };

export const createCompliance = createAsyncThunk(
  'compliance/createCompliance',
  async (complianceData: ComplianceData) => {
    try{

      const { data } = await httpClient.post(endpoints.compliances.create(), complianceData);
      return data;
    }
    catch(error : any) {
      const err = error as AxiosError<any>;
      JSON.stringify(err.response?.data.message)
      err.response?.data.message.map((v: string) => {
        // openNotification('danger', 'Failed to create compliance', v)
      //   toast.push(
      //     <Notification title="Copy Success" type="success">
      //     </Notification>,

      // )
       
    })
    }
    } 
);

export const updateCompliance = createAsyncThunk(
  'compliance/updateCompliance',
  async ({ id, data }: { id: string; data: ComplianceData}) => {
      const response = await httpClient.put(endpoints.compliances.update(id), data);
      return response.data;
    }
);



export const fetchComplianceById = createAsyncThunk(
  'compliance/fetchComplianceById',
  async (id: string) => {
      const { data } = await httpClient.get(endpoints.compliances.getById(id));
      return data;
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
        console.log(action.payload);
        
        state.loading = false;
        state.error = action.payload as string;
        console.log(state.error);
        
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