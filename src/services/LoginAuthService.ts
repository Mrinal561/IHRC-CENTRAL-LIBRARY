import ApiService from './ApiService'
import type {
    LogInCredential,
    LogInResponse
} from '@/@types/login'

export async function loginApiSignIn(data: LogInCredential) {
    return ApiService.fetchData<LogInResponse>({
        url: '/login',
        method: 'post',
        data,
    })
}

// export async function apiSignUp(data: SignUpCredential) {
//     return ApiService.fetchData<SignUpResponse>({
//         url: '/sign-up',
//         method: 'post',
//         data,
//     })
// }

// export async function apiSignOut() {
//     return ApiService.fetchData({
//         url: '/sign-out',
//         method: 'post',
//     })
// }

// export async function apiForgotPassword(data: ForgotPassword) {
//     return ApiService.fetchData({
//         url: '/forgot-password',
//         method: 'post',
//         data,
//     })
// }

// export async function apiResetPassword(data: ResetPassword) {
//     return ApiService.fetchData({
//         url: '/reset-password',
//         method: 'post',
//         data,
//     })
// }
