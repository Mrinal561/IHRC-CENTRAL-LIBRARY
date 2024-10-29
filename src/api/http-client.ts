import axios from 'axios'
import store, { setIsAuthenticated } from '@/store'
// import { login } from '@/store/features/auth';
// import { loginUser } from '@/store/features/auth/authSlice'
import Cookies from 'js-cookie'

const httpClient = axios.create({
    // withCredentials: true,
})

httpClient.interceptors.request.use(function (config) {
    const token = Cookies.get('token')
    // const clientId = process.env.NEXT_PUBLIC_LOCAL_CLIENT_ID;

    if (token && !config.headers['Authorization']) {
        //@ts-ignore
        config.headers = {
            ...(config.headers || {}),
            Authorization: `Bearer ${token}`,
        }
    }

    return config
})

httpClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (
            error.response?.status === 401
            // &&
            // !error.request.responseURL.includes('superadmin/profile')
        ) {
            // store.dispatch(setIsAuthenticated(false))
        }
        return Promise.reject(error)
    },
)

export default httpClient
