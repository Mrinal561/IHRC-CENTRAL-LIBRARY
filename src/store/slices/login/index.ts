import { combineReducers } from '@reduxjs/toolkit'
import session, { SessionLoginState } from './sessionSlice'
import user, { LoginState } from './loginSlice'

const reducer = combineReducers({
    // session,
    user,
})

export type AuthenticationState = {
    // session: SessionLoginState
    user: LoginState
}

// export * from './sessionSlice'
export * from './loginSlice'

export default reducer
