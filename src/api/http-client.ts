import axios from 'axios'
import store, { setIsAuthenticated } from '@/store'
// import { login } from '@/store/features/auth';
// import { loginUser } from '@/store/features/auth/authSlice'
import Cookies from 'js-cookie'
import { showErrorNotification } from '@/components/ui/ErrorMessage'

const httpClient = axios.create({
    // withCredentials: true,
})

httpClient.interceptors.request.use(function (config) {
    const token = Cookies.get('central_token')
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
        console.log(error)
        if (
            (error.response?.status == 401 &&
                !error.request.responseURL.includes('companyadmin/profile')) ||
            error.response?.status === 403
        ) {
            console.log('okkk')
            // store.dispatch(loginUser());
            window.location.reload()
        } else if (
            error.response?.status !== 401 &&
            error.response?.data?.message?.length
        ) {
            showErrorNotification(error.response?.data.message)
        } else if (error.response?.status !== 401 && error.message.length) {
            showErrorNotification(error.message)
        } else if (error.response?.status !== 401 && error.length) {
            showErrorNotification(
                error || 'Something went wrong ! Please try again !',
            )
        }

        return Promise.reject(error)
    },
)

export default httpClient
