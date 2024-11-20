import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { endpoints } from '@/api/endpoint'
import httpClient from '@/api/http-client'
import { AxiosError } from 'axios'
import { toast, Notification } from '@/components/ui'
import { ComplianceData } from '@/@types/compliance'


export interface ComplianceState {
    compliances: ComplianceData[]
    loading: boolean
    error: string | null
    currentCompliance: ComplianceData | null;
    paginateData: {
        totalResults: number;
        totalPages: number;
        page: number;
        limit: number;
      } | null;
}

const initialState: ComplianceState = {
    compliances: [],
    loading: false,
    error: null,
    currentCompliance: null,
    paginateData: null,

}

// Async thunks for API calls
export const fetchCompliances = createAsyncThunk(
    'compliance/fetchCompliances',
    async  ({ page, page_size }: { page: number, page_size: number }, { rejectWithValue }) => {
        try{
            const { data } = await httpClient.get(endpoints.compliances.getAll(), {
                params: {
                    page,
                    page_size: page_size,
                  },
            })
            return {
                data: data.data,
                paginateData: {
                    totalResults: data.paginate_data.totalResults,
                    totalPages: data.paginate_data.totalPages || 0,
                    page: page, // Use the requested page number
                    limit: page_size, 
                },
              };
        }
        catch(error : any) {
            return rejectWithValue(error.response?.data.message)
        }
    },
)


export const createCompliance = createAsyncThunk(
    'compliance/createCompliance',
    async (complianceData: ComplianceData, { rejectWithValue }) => {
        try {
            const { data } = await httpClient.post(
                endpoints.compliances.create(),
                complianceData,
            )
            return data
        } catch (error: any) {
            // const err = error as AxiosError<any>
            return rejectWithValue(error.response?.data.message)
        }
    },
)

export const updateCompliance = createAsyncThunk(
    'compliance/updateCompliance',
    async ({ id, data }: { id: string; data: ComplianceData }) => {
        const response = await httpClient.put(
            endpoints.compliances.update(id),
            data,
        )
        return response.data
    },
)

export const fetchComplianceById = createAsyncThunk(
    'compliance/fetchComplianceById',
    async (id: string) => {
        const { data } = await httpClient.get(endpoints.compliances.getById(id))
        return data
    },
)

export const deleteCompliance = createAsyncThunk(
    'compliance/deleteCompliance',
    async (id: string, { rejectWithValue }) => {
      try {
        console.log(id)
        await httpClient.delete(endpoints.compliances.delete(id));
       return id;
      } catch (error: any) {
        const err = error as AxiosError<any>
        return rejectWithValue(err.response?.data?.message);
      }
    }
  );


const complianceSlice = createSlice({
    name: 'compliance',
    initialState,
    reducers: {
        clearCurrentCompliance: (state) => {
            state.currentCompliance = null
        },
        clearError: (state) => {
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch All Compliances
            .addCase(fetchCompliances.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchCompliances.fulfilled, (state, action) => {
                state.loading = false
                state.compliances = action.payload.data;
                state.paginateData = action.payload.paginateData;
            })
            .addCase(fetchCompliances.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
            // Create Compliance
            .addCase(createCompliance.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(createCompliance.fulfilled, (state, action) => {
                state.loading = false
                if (action.payload) {
                    state.compliances = [...state.compliances, action.payload]
                }
            })
            .addCase(createCompliance.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
            // Update Compliance
            .addCase(updateCompliance.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(updateCompliance.fulfilled, (state, action) => {
                state.loading = false
                if (action.payload) {
                    state.compliances = state.compliances.map((compliance) =>
                        compliance.id === action.payload.id
                            ? action.payload
                            : compliance,
                    )
                }
            })
            .addCase(updateCompliance.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })

            // Fetch Compliance by ID
            .addCase(fetchComplianceById.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchComplianceById.fulfilled, (state, action) => {
                state.loading = false
                state.currentCompliance = action.payload
            })
            .addCase(fetchComplianceById.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
            .addCase(deleteCompliance.pending, (state) => {
                state.loading = true;
                state.error = null;
              })
              .addCase(deleteCompliance.fulfilled, (state, action) => {
                state.loading = false;
              //   state.companyGroups = state.companyGroups.filter((g) => g.id !== action.payload);
              })
              .addCase(deleteCompliance.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
              })


    },
})

export const { clearCurrentCompliance, clearError } = complianceSlice.actions
export default complianceSlice.reducer
