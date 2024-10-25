import { Navigate, Outlet } from 'react-router-dom'
import appConfig from '@/configs/app.config'
import useAuth from '@/utils/hooks/useAuth'
import Cookies from 'js-cookie'

const { authenticatedEntryPath } = appConfig

const PublicRoute = () => {
    const authenticated = Cookies.get('token')

    return authenticated ? <Navigate to={authenticatedEntryPath} /> : <Outlet />
}

export default PublicRoute
