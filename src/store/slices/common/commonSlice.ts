import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { httpClient } from '@/api/httpClient';
import { endpoints } from '@/api/endpoint';
import { CommonStateData } from '@/@types/commonApi';
import httpClient from '@/api/http-client';
// import type { CommonCompanyData } from './CommonService';

interface CommonState {
    data: CommonStateData[];
    loading: boolean;
}

const initialState: CommonState = {
    data: [],
    loading: false,
};

export const fetchAll = createAsyncThunk(
    'common/fetchAll',
    async () => {
            const { data } = await httpClient.get(endpoints.common.getStatesAll());
            return data;
    }
);

const commonSlice = createSlice({
    name: 'common',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAll.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAll.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
            })
            .addCase(fetchAll.rejected, (state) => {
                state.loading = false;
            });
    },
});

export const selectCommonData = (state: { common: CommonState }) => state.common.data;
export const selectLoading = (state: { common: CommonState }) => state.common.loading;

export default commonSlice.reducer;