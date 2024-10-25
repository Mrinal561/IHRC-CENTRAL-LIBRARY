import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SLICE_BASE_NAME } from './constants'

export type LoginState = {
    userName?: string
    password?: string
}

const initialState: LoginState = {
    userName: '',
    password: '',
}

const loginSlice = createSlice({
    name: `${SLICE_BASE_NAME}/user`,
    initialState,
    reducers: {
        setLoginUser(state, action: PayloadAction<LoginState>) {
            state.userName = action.payload?.userName
            state.password = action.payload?.password
        },
    },
})

export const { setLoginUser } = loginSlice.actions
export default loginSlice.reducer
