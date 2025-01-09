import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { endpoints } from "@/api/endpoint";
import httpClient from "@/api/http-client";

export interface CompanyGroupData{
    id:string;
    name:string;
    created_by:number;
}

export interface CompanyGroupState
{
    companyGroups: CompanyGroupData[];
    loading:boolean;
    error: string | null;
    currentcompanyGroup : CompanyGroupData | null;
}


const initialState: CompanyGroupState = {
    companyGroups: [],
    loading:false,
    error: null,
    currentcompanyGroup :null,
}


// export const fetchCompanyGroups = createAsyncThunk(
//   'companyGroup/fetchCompanyGroups',
//   async (param: any, { rejectWithValue }) => {
//     try {
//       const { data } = await httpClient.get(endpoints.companyGroup.getAll(), {
//         params: param,
//       });
//       return data;
//     } catch (error: any) {
//       const err = error as AxiosError<any>
//       return rejectWithValue(err.response?.data?.message || 'Failed to fetch company groups');
//     }
//   }
// );
  
export const createCompanyGroup = createAsyncThunk(
  'companyGroup/createCompanyGroup',
  async (groupData: Omit<CompanyGroupData, 'id'>, { rejectWithValue }) => {
    try {
      const { data } = await httpClient.post(endpoints.companyGroup.create(), groupData);
      return data;
    } catch (error: any) {
      const err = error as AxiosError<any>
      return rejectWithValue(err.response?.data?.message || 'Failed to create company group');
    }
  }
);


export const updateCompanyGroup = createAsyncThunk(
  'companyGroup/updateCompanyGroup',
  async ({ id, data }: { id: string; data: Partial<CompanyGroupData> }, { rejectWithValue }) => {
    try {
      const response = await httpClient.put(endpoints.companyGroup.update(id), data);
      return response.data;
    } catch (error: any) {
      const err = error as AxiosError<any>
      return rejectWithValue(err.response?.data?.message || 'Failed to update company group');
    }
  }
);
  
// export const deleteCompanyGroup = createAsyncThunk(
//   'companyGroup/deleteCompanyGroup',
//   async (id: string, { rejectWithValue }) => {
//     try {
//       console.log(id)
//       await httpClient.delete(endpoints.companyGroup.delete(id));
//      return id;
//     } catch (error: any) {
//       const err = error as AxiosError<any>
//       return rejectWithValue(err.response?.data?.message);
//     }
//   }
// );
  
export const fetchCompanyGroupById = createAsyncThunk(
  'companyGroup/fetchCompanyGroupById',
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await httpClient.get(endpoints.companyGroup.getById(id));
      return data;
    } catch (error: any) {
      const err = error as AxiosError<any>
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch company group by ID');
    }
  }
);

  
  const companyGroupSlice = createSlice({
    name: 'companyGroup',
    initialState,
    reducers: {
      clearCurrentCompanyGroup: (state) => {
        state.currentcompanyGroup = null;
      },
      clearError: (state) => {
        state.error = null;
      },
    },
    extraReducers: (builder) => {
      builder
        // Fetch All Company Groups
        // .addCase(fetchCompanyGroups.pending, (state) => {
        //   state.loading = true;
        //   state.error = null;
        // })
        // .addCase(fetchCompanyGroups.fulfilled, (state, action) => {
        //   state.loading = false;
        //   state.companyGroups = action.payload;
        // })
        // .addCase(fetchCompanyGroups.rejected, (state, action) => {
        //   state.loading = false;
        //   state.error = action.payload as string;
        // })
        // Create Company Group
        .addCase(createCompanyGroup.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(createCompanyGroup.fulfilled, (state, action) => {
          state.loading = false;
        //   state.companyGroups.push(action.payload);
        })
        .addCase(createCompanyGroup.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        })
        // Update Company Group
        .addCase(updateCompanyGroup.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(updateCompanyGroup.fulfilled, (state, action) => {
          state.loading = false;
        //   const index = state.companyGroups.findIndex((g) => g.id === action.payload.id);
        //   if (index !== -1) {
        //     state.companyGroups[index] = action.payload;
        //   }
        })
        .addCase(updateCompanyGroup.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        })
        // Delete Company Group
        // .addCase(deleteCompanyGroup.pending, (state) => {
        //   state.loading = true;
        //   state.error = null;
        // })
        // .addCase(deleteCompanyGroup.fulfilled, (state, action) => {
        //   state.loading = false;
        // //   state.companyGroups = state.companyGroups.filter((g) => g.id !== action.payload);
        // })
        // .addCase(deleteCompanyGroup.rejected, (state, action) => {
        //   state.loading = false;
        //   state.error = action.payload as string;
        // })
        // Fetch Company Group by ID
        .addCase(fetchCompanyGroupById.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchCompanyGroupById.fulfilled, (state, action) => {
          state.loading = false;
          state.currentcompanyGroup = action.payload;
        })
        .addCase(fetchCompanyGroupById.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        })
    },
  });
  
  export const { clearCurrentCompanyGroup, clearError } = companyGroupSlice.actions;
  export default companyGroupSlice.reducer;