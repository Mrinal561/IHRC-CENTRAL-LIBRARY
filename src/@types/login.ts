export type LogInCredential = {
    userName: string
    password: string
}

export type LogInResponse = {
    token: string
    user: {
        userName: string
        email: string
    }
}

// export type SignUpResponse = LogInResponse

// export type SignUpCredential = {
//     userName: string
//     email: string
//     password: string
// }

// export type ForgotPassword = {
//     email: string
// }

// export type ResetPassword = {
//     password: string
// }
