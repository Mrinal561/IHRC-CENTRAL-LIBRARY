import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
// import { SLICE_BASE_NAME } from './constants'
import { AuthUser } from '@/interface/interfaces'
import httpClient from '@/api/http-client'
import { endpoints } from '@/api/endpoint'

export type LoginState = {
    loading: boolean
    user?: AuthUser
    authenticated: boolean
}

const initialState: LoginState = {
    loading: true,
    authenticated: false,
}
export const fetchAuthUser = createAsyncThunk(
    'auth/fetchAuthUser',
    async () => {
        const { data } = await httpClient.get(endpoints.auth.profile())
        return data
    },
)

const loginSlice = createSlice({
    name: `auth`,
    initialState,
    reducers: {
        setIsAuthenticated: (
            state,
            action: PayloadAction<LoginState['authenticated']>,
        ) => {
            state.authenticated = action.payload
        },

        setLoginUser(
            state,
            action: PayloadAction<LoginState['user'] | undefined>,
        ) {
            state.user = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAuthUser.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchAuthUser.fulfilled, (state, action) => {
                state.loading = false
                if (!action.payload) {
                    return
                }
                state.user = action.payload
            })
            .addCase(fetchAuthUser.rejected, (state) => {
                state.loading = false
                state.user = undefined
            })
    },
})

export const { setLoginUser, setIsAuthenticated } = loginSlice.actions
export default loginSlice.reducer
