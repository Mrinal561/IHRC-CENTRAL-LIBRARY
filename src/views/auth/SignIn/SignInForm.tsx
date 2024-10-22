// import Input from '@/components/ui/Input'
// import Button from '@/components/ui/Button'
// import Checkbox from '@/components/ui/Checkbox'
// import { FormItem, FormContainer } from '@/components/ui/Form'
// import Alert from '@/components/ui/Alert'
// import PasswordInput from '@/components/shared/PasswordInput'
// import ActionLink from '@/components/shared/ActionLink'
// import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
// import useAuth from '@/utils/hooks/useAuth'
// import { Field, Form, Formik } from 'formik'
// import * as Yup from 'yup'
// import type { CommonProps } from '@/@types/common'

// interface SignInFormProps extends CommonProps {
//     disableSubmit?: boolean
//     forgotPasswordUrl?: string
//     signUpUrl?: string
// }

// type SignInFormSchema = {
//     userName: string
//     password: string
//     rememberMe: boolean
// }

// const validationSchema = Yup.object().shape({
//     userName: Yup.string().required('Please enter your user name'),
//     password: Yup.string().required('Please enter your password'),
//     rememberMe: Yup.bool(),
// })

// const SignInForm = (props: SignInFormProps) => {
//     const {
//         disableSubmit = false,
//         className,
//         forgotPasswordUrl = '/forgot-password',
//         signUpUrl = '/sign-up',
//     } = props

//     const [message, setMessage] = useTimeOutMessage()

//     const { signIn } = useAuth()

//     const onSignIn = async (
//         values: SignInFormSchema,
//         setSubmitting: (isSubmitting: boolean) => void
//     ) => {
//         const { userName, password } = values
//         setSubmitting(true)

//         const result = await signIn({ userName, password })

//         if (result?.status === 'failed') {
//             setMessage(result.message)
//         }

//         setSubmitting(false)
//     }

//     return (
//         <div className={className}>
//             {message && (
//                 <Alert showIcon className="mb-4" type="danger">
//                     <>{message}</>
//                 </Alert>
//             )}
//             <Formik
//                 initialValues={{
//                     userName: 'admin',
//                     password: '123Qwe',
//                     rememberMe: true,
//                 }}
//                 validationSchema={validationSchema}
//                 onSubmit={(values, { setSubmitting }) => {
//                     if (!disableSubmit) {
//                         onSignIn(values, setSubmitting)
//                     } else {
//                         setSubmitting(false)
//                     }
//                 }}
//             >
//                 {({ touched, errors, isSubmitting }) => (
//                     <Form>
//                         <FormContainer>
//                             <FormItem
//                                 label="User Name"
//                                 invalid={
//                                     (errors.userName &&
//                                         touched.userName) as boolean
//                                 }
//                                 errorMessage={errors.userName}
//                             >
//                                 <Field
//                                     type="text"
//                                     autoComplete="off"
//                                     name="userName"
//                                     placeholder="User Name"
//                                     component={Input}
//                                 />
//                             </FormItem>
//                             <FormItem
//                                 label="Password"
//                                 invalid={
//                                     (errors.password &&
//                                         touched.password) as boolean
//                                 }
//                                 errorMessage={errors.password}
//                             >
//                                 <Field
//                                     autoComplete="off"
//                                     name="password"
//                                     placeholder="Password"
//                                     component={PasswordInput}
//                                 />
//                             </FormItem>
//                             <div className="flex justify-between mb-6">
//                                 <Field
//                                     className="mb-0"
//                                     name="rememberMe"
//                                     component={Checkbox}
//                                 >
//                                     Remember Me
//                                 </Field>
//                                 <ActionLink to={forgotPasswordUrl}>
//                                     Forgot Password?
//                                 </ActionLink>
//                             </div>
//                             <Button
//                                 block
//                                 loading={isSubmitting}
//                                 variant="solid"
//                                 type="submit"
//                             >
//                                 {isSubmitting ? 'Signing in...' : 'Sign In'}
//                             </Button>
//                             <div className="mt-4 text-center">
//                                 <span>{`Don't have an account yet?`} </span>
//                                 <ActionLink to={signUpUrl}>Sign up</ActionLink>
//                             </div>
//                         </FormContainer>
//                     </Form>
//                 )}
//             </Formik>
//         </div>
//     )
// }

// export default SignInForm


import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { sha256 } from 'js-sha256'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Alert from '@/components/ui/Alert'
import PasswordInput from '@/components/shared/PasswordInput'
import ActionLink from '@/components/shared/ActionLink'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import type { CommonProps } from '@/@types/common'
import httpClient from '@/api/http-client'
import endpoints from '@/api/endpoint'
import { useAppDispatch } from '@/store/hook'
import { fetchAuthUser } from '@/store/slices/auth/auth'
// import { settingActions } from '@/store/features/setting'
// import { showErrorNotification, showSuccessNotification } from '@/utils/notification'
import type { AuthUser } from '@/interfaces/user.interface'
import type { AxiosError } from 'axios'

interface SignInFormProps extends CommonProps {
    disableSubmit?: boolean
    forgotPasswordUrl?: string
    signUpUrl?: string
}

type SignInFormSchema = {
    email: string
    password: string
    remember: boolean
}

const validationSchema = Yup.object().shape({
    email: Yup.string()
        .required('Email is required')
        .email('Email is not valid'),
    password: Yup.string()
        .required('Password is required'),
    remember: Yup.bool()
})

const SignInForm = (props: SignInFormProps) => {
    const {
        disableSubmit = false,
        className,
        forgotPasswordUrl = '/forgot-password',
        signUpUrl = '/sign-up',
    } = props

    const [message, setMessage] = useState<string>('')
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const handleSignIn = async (
        values: SignInFormSchema,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        setSubmitting(true)
        try {
            // Call login API with hashed password
            const { data } = await httpClient.post(endpoints.auth.login(), {
                ...values,
                password: values.password ? sha256(values.password) : values.password,
            })

            // Store expiration time
            localStorage.setItem('expires_at', data.expires_at)

            // Fetch user profile using Redux thunk
            const authResult = await dispatch(fetchAuthUser())
            
            if (authResult.payload) {
                const payload = authResult.payload as AuthUser

                // Handle platform selection if exists
                if (localStorage.getItem('platform')) {
                    const platform = payload.platforms.find(
                        (v) => v.uuid === localStorage.getItem('platform')
                    )
                    // if (platform) {
                    //     dispatch(settingActions.setPlatform(platform))
                    // } else {
                    //     localStorage.removeItem('platform')
                    // }
                }

                // showSuccessNotification('Login successful')
                navigate('/home')
            } else {
                setMessage('An error occurred while fetching user profile')
                // showErrorNotification()
            }
        } catch (error) {
            const err = error as AxiosError
            if (err.response?.status === 401) {
                setMessage('Invalid email or password')
                // showErrorNotification('Invalid email or password')
            } else {
                setMessage('An error occurred during login')
                // showErrorNotification()
            }
        }
        setSubmitting(false)
    }

    return (
        <div className={className}>
            {message && (
                <Alert showIcon className="mb-4" type="danger">
                    {message}
                </Alert>
            )}
            <Formik
                initialValues={{
                    email: '',
                    password: '',
                    remember: false
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    if (!disableSubmit) {
                        handleSignIn(values, setSubmitting)
                    } else {
                        setSubmitting(false)
                    }
                }}
            >
                {({ touched, errors, isSubmitting }) => (
                    <Form>
                        <FormContainer>
                            <FormItem
                                label="Email"
                                invalid={(errors.email && touched.email) as boolean}
                                errorMessage={errors.email}
                            >
                                <Field
                                    type="email"
                                    autoComplete="email"
                                    name="email"
                                    placeholder="Email"
                                    component={Input}
                                />
                            </FormItem>
                            <FormItem
                                label="Password"
                                invalid={(errors.password && touched.password) as boolean}
                                errorMessage={errors.password}
                            >
                                <Field
                                    autoComplete="current-password"
                                    name="password"
                                    placeholder="Password"
                                    component={PasswordInput}
                                />
                            </FormItem>
                            <div className="flex justify-between mb-6">
                                <Field
                                    className="mb-0"
                                    name="remember"
                                    component={Checkbox}
                                >
                                    Remember Me
                                </Field>
                                <ActionLink to={forgotPasswordUrl}>
                                    Forgot Password?
                                </ActionLink>
                            </div>
                            <Button
                                block
                                loading={isSubmitting}
                                variant="solid"
                                type="submit"
                            >
                                {isSubmitting ? 'Signing in...' : 'Sign In'}
                            </Button>
                            <div className="mt-4 text-center">
                                <span>{`Don't have an account yet?`} </span>
                                <ActionLink to={signUpUrl}>Sign up</ActionLink>
                            </div>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default SignInForm