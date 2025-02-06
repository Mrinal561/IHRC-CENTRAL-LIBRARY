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
import esiconfig, { ESIConfigState } from './slices/esiConfig/esiConfigSlice'
import lwfconfig, { LWFConfigState } from './slices/lwfConfig/lwfConfigSlice';
import ptconfig,  { PTSetupState } from './slices/ptConfig/ptConfigSlice'
import companyadmin,{ CompanyAdminState } from './slices/companyAdmin/companyAdminSlice'
import companygroup, { CompanyGroupState } from './slices/companyAdmin/companyGroupSlice'

export type RootState = CombinedState<{
    auth: CombinedState<AuthState>
    base: CombinedState<BaseState>
    login:CombinedState<AuthenticationState>
    state: StateState,
    compliance: ComplianceState,
    pfconfig: PFConfigState,
    esiconfig: ESIConfigState,
    lwfconfig: LWFConfigState,
    ptconfig: PTSetupState,
    district: DistrictState,
    companyadmin: CompanyAdminState,
    locale: LocaleState
    theme: ThemeState
    companygroup: CompanyGroupState
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
    esiconfig,
    lwfconfig,
    ptconfig,
    companyadmin,
    companygroup,
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
