import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SLICE_BASE_NAME } from './constants'

export interface SessionLoginState {
    signedIn: boolean
    token: string | null
}

const initialState: SessionLoginState = {
    signedIn: false,
    token: null,
}

const sessionLoginSlice = createSlice({
    name: `${SLICE_BASE_NAME}/session`,
    initialState,
    reducers: {
        logInSuccess(state, action: PayloadAction<string>) {
            state.signedIn = true
            state.token = action.payload
        },
        logOutSuccess(state) {
            state.signedIn = false
            state.token = null
        },
    },
})

export const { logInSuccess, logOutSuccess } = sessionLoginSlice.actions
export default sessionLoginSlice.reducer
