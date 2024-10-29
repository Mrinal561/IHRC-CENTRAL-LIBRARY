import appConfig from '@/configs/app.config'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useAuth from '@/utils/hooks/useAuth'
import Cookies from 'js-cookie'
import { useAppSelector } from '@/store'

const { unAuthenticatedEntryPath } = appConfig

const ProtectedRoute = () => {
    const authenticated = useAppSelector(
        (state) => state.login.user.authenticated,
    )
    const location = useLocation()

    if (!authenticated) {
        return (
            <Navigate
                replace
                to={`${unAuthenticatedEntryPath}?${REDIRECT_URL_KEY}=${location.pathname}`}
            />
        )
    }

    return <Outlet />
}

export default ProtectedRoute
