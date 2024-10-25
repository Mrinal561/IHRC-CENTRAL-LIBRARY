import { Navigate, Outlet } from 'react-router-dom'
import appConfig from '@/configs/app.config'
import useAuth from '@/utils/hooks/useAuth'
import Cookies from 'js-cookie'
import { useSelector } from 'react-redux'
import { useAppSelector } from '@/store'

const { authenticatedEntryPath } = appConfig

const PublicRoute = () => {
    const authenticated = useAppSelector(
        (state) => state.login.user.authenticated,
    )

    return authenticated ? <Navigate to={authenticatedEntryPath} /> : <Outlet />
}

export default PublicRoute
