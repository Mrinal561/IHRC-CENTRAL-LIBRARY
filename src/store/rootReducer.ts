import { combineReducers, CombinedState, AnyAction, Reducer } from 'redux'
import auth, { AuthState } from './slices/auth'
import base, { BaseState } from './slices/base'
import login, {AuthenticationState} from './slices/login'
import locale, { LocaleState } from './slices/locale/localeSlice'
import theme, { ThemeState } from './slices/theme/themeSlice'
import state, { StateState } from '@/store/slices/state/stateSlice'
import RtkQueryService from '@/services/RtkQueryService'
import compliance, { ComplianceState } from './slices/compliances/compliancesSlice'
import pfconfig, { PFConfigState } from './slices/pfConfig/pfConfigSlice'
import district, { DistrictState } from './slices/district/districtSlice'



export type RootState = CombinedState<{
    auth: CombinedState<AuthState>
    base: CombinedState<BaseState>
    login:CombinedState<AuthenticationState>
    state: StateState,
    compliance: ComplianceState,
    pfconfig: PFConfigState,
    district: DistrictState,
    locale: LocaleState
    theme: ThemeState
    /* eslint-disable @typescript-eslint/no-explicit-any */
    [RtkQueryService.reducerPath]: any
}>

export interface AsyncReducers {
    [key: string]: Reducer<any, AnyAction>
}

const staticReducers = {
    auth,
    base,
    locale,
    theme,
    login,
    state,
    district,
    compliance,
    pfconfig,
    [RtkQueryService.reducerPath]: RtkQueryService.reducer,
}

const rootReducer =
    (asyncReducers?: AsyncReducers) =>
    (state: RootState, action: AnyAction) => {
        const combinedReducer = combineReducers({
            ...staticReducers,
            ...asyncReducers,
        })
        return combinedReducer(state, action)
    }

export default rootReducer
