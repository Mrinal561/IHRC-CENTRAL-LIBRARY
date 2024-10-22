import { RootState } from './../../rootReducer';
import endpoints from "../../../api/endpoint";
import httpClient from "../../../api/http-client";
import { AuthUser } from "../../../interfaces/user.interface";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
// import  RootState  from "../../rootReducer";

export interface AuthState {
  loading: boolean;
  user?: AuthUser;
}

const initialState: AuthState = {
  loading: true,
};

export const fetchAuthUser = createAsyncThunk(
  "auth/fetchAuthUser",
  async () => {
    const { data } = await httpClient.get(endpoints.auth.profile());
    return data;
  }
);

export const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<AuthState["user"] | undefined>) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuthUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAuthUser.fulfilled, (state, action) => {
        state.loading = false;
        if (!action.payload) {
          return;
        }
        state.user = action.payload;
      })
      .addCase(fetchAuthUser.rejected, (state) => {
        state.loading = false;
        state.user = undefined;
      });
  },
});

export const authActions = auth.actions;

export const selectAuth = (state: RootState) => state.auth;

export default auth.reducer;
