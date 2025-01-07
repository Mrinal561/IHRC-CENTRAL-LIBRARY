import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Alert from '@/components/ui/Alert'
import PasswordInput from '@/components/shared/PasswordInput'
import ActionLink from '@/components/shared/ActionLink'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import useAuth from '@/utils/hooks/useAuth'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import type { CommonProps } from '@/@types/common'
import httpClient from '@/api/http-client'
import { endpoints } from '@/api/endpoint'
import { AxiosError } from 'axios'
import { Notification, toast } from '@/components/ui'
import {
    fetchAuthUser,
    setIsAuthenticated,
} from '@/store/slices/login/loginSlice'
import { useAppDispatch } from '@/store'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import useQuery from '@/utils/hooks/useQuery'
import appConfig from '@/configs/app.config'

interface SignInFormProps extends CommonProps {
    disableSubmit?: boolean
    forgotPasswordUrl?: string
    signUpUrl?: string
}

type SignInFormSchema = {
    userName: string
    password: string
    // rememberMe: boolean
}

const validationSchema = Yup.object().shape({
    userName: Yup.string().required('Please enter your user name'),
    password: Yup.string().required('Please enter your password'),
    rememberMe: Yup.bool(),
})

const SignInForm = (props: SignInFormProps) => {
    const {
        disableSubmit = false,
        className,
        forgotPasswordUrl = '/forgot-password',
        signUpUrl = '/sign-up',
    } = props

    const [message, setMessage] = useTimeOutMessage()
    const query = useQuery()

    const { LogIn } = useAuth()
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const onSignIn = async (values: SignInFormSchema) => {
        setLoading(true)
        try {
            console.log('Attempting API call...') // Check if this logs
            const { data } = await httpClient.post(endpoints.auth.login(), {
                email: values.userName,
                password: values.password,
            })
            console.log('API call succeeded:', data) // Check if this logs

            console.log(data)

            Cookies.set('token', data.access_token, { path: '/' })

            dispatch(fetchAuthUser()).then(({ payload }) => {
                if (payload) {
                    dispatch(setIsAuthenticated(true))
                    //   if (localStorage.getItem("platform")) {
                    //     const platform = (payload as AuthUser).platforms.find(
                    //       (v) => v.uuid == localStorage.getItem("platform")
                    //     );
                    //     if (platform) {
                    //       dispatch(settingActions.setPlatform(platform));
                    //     } else {
                    //       localStorage.removeItem("platform");
                    //     }
                    //   }
                    toast.push(
                        <Notification title="succes" type="success">
                            Login successful
                        </Notification>,
                        {
                            placement: 'top-end',
                        },
                    )
                    const redirectUrl = query.get(REDIRECT_URL_KEY)
                    console.log(
                        redirectUrl,
                        redirectUrl
                            ? redirectUrl
                            : appConfig.authenticatedEntryPath,
                    )
                    navigate(
                        redirectUrl
                            ? redirectUrl
                            : appConfig.authenticatedEntryPath,
                    )
                } else {
                    // showErrorNotification()
                }
            })

            setLoading(false)
        } catch (error) {
            const err = error as AxiosError
            if (err.response?.status == 401) {
                toast.push(
                    <Notification title="error" type="danger">
                        Invalid email or password{' '}
                    </Notification>,
                    {
                        placement: 'top-end',
                    },
                )
            } else {
                toast.push(
                    <Notification title="error" type="danger">
                        Something went wrong! Please Try again.{' '}
                    </Notification>,
                    {
                        placement: 'top-end',
                    },
                )
            }
        }

        setLoading(false)
    }

    return (
        <div className={className}>
            {message && (
                <Alert showIcon className="mb-4" type="danger">
                    <>{message}</>
                </Alert>
            )}
            <Formik
                initialValues={{
                    userName: '',
                    password: '',
                    // rememberMe: true,
                }}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                    onSignIn(values)
                }}
            >
                {({ touched, errors, isSubmitting }) => (
                    <Form>
                        <FormContainer>
                            <FormItem
                                label="Email"
                                invalid={
                                    (errors.userName &&
                                        touched.userName) as boolean
                                }
                                errorMessage={errors.userName}
                            >
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="userName"
                                    placeholder="Email"
                                    component={Input}
                                />
                            </FormItem>
                            <FormItem
                                label="Password"
                                invalid={
                                    (errors.password &&
                                        touched.password) as boolean
                                }
                                errorMessage={errors.password}
                            >
                                <Field
                                    autoComplete="off"
                                    name="password"
                                    placeholder="Password"
                                    component={PasswordInput}
                                />
                            </FormItem>
                            <div className="flex justify-between mb-6">
                                {/* <Field
                                    className="mb-0"
                                    name="rememberMe"
                                    component={Checkbox}
                                >
                                    Remember Me
                                </Field> */}
                                <ActionLink to={forgotPasswordUrl}>
                                    Forgot Password?
                                </ActionLink>
                            </div>
                            <Button
                                block
                                loading={loading}
                                variant="solid"
                                type="submit"
                            >
                                {loading ? 'Signing in...' : 'Sign In'}
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
