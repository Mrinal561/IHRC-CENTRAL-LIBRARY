// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// // import { httpClient } from '@/api/httpClient';
// import { endpoints } from '@/api/endpoint';
// import { CommonStateData } from '@/@types/commonApi';
// import httpClient from '@/api/http-client';
// // import type { CommonCompanyData } from './CommonService';

// interface CommonState {
//     data: CommonStateData[];
//     loading: boolean;
// }

// const initialState: CommonState = {
//     data: [],
//     loading: false,
// };

// export const fetchAll = createAsyncThunk(
//     'common/fetchAll',
//     async () => {
//             const { data } = await httpClient.get(endpoints.common.getStatesAll());
//             return data;
//     }
// );

// const commonSlice = createSlice({
//     name: 'common',
//     initialState,
//     reducers: {},
//     extraReducers: (builder) => {
//         builder
//             .addCase(fetchAll.pending, (state) => {
//                 state.loading = true;
//             })
//             .addCase(fetchAll.fulfilled, (state, action) => {
//                 state.data = action.payload;
//                 state.loading = false;
//             })
//             .addCase(fetchAll.rejected, (state) => {
//                 state.loading = false;
//             });
//     },
// });

// export const selectCommonData = (state: { common: CommonState }) => state.common.data;
// export const selectLoading = (state: { common: CommonState }) => state.common.loading;

// export default commonSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { endpoints } from '@/api/endpoint';
import { CommonStateData } from '@/@types/commonApi';
import httpClient from '@/api/http-client';

interface CommonState {
    data: CommonStateData[];
    detail: CommonStateData | null;
    loading: boolean;
    detailLoading: boolean;
}

const initialState: CommonState = {
    data: [],
    detail: null,
    loading: false,
    detailLoading: false,
};

export const fetchAll = createAsyncThunk(
    'common/fetchAll',
    async () => {
        const { data } = await httpClient.get(endpoints.common.getStatesAll());
        return data;
    }
);

export const fetchDetail = createAsyncThunk(
    'common/fetchDetail',
    async (id: string | number) => {
        const { data } = await httpClient.get(endpoints.common.detail(id));
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
            })
            .addCase(fetchDetail.pending, (state) => {
                state.detailLoading = true;
            })
            .addCase(fetchDetail.fulfilled, (state, action) => {
                state.detail = action.payload;
                state.detailLoading = false;
            })
            .addCase(fetchDetail.rejected, (state) => {
                state.detailLoading = false;
            });
    },
});

export const selectCommonData = (state: { common: CommonState }) => state.common.data;
export const selectDetail = (state: { common: CommonState }) => state.common.detail;
export const selectLoading = (state: { common: CommonState }) => state.common.loading;
export const selectDetailLoading = (state: { common: CommonState }) => state.common.detailLoading;

export default commonSlice.reducer;