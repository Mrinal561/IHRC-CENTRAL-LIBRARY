import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import PasswordInput from '@/components/shared/PasswordInput'
import ActionLink from '@/components/shared/ActionLink'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import type { CommonProps } from '@/@types/common'
import httpClient from '@/api/http-client'
import { endpoints } from '@/api/endpoint'
import { AxiosError } from 'axios'
import { Notification, toast } from '@/components/ui'
import { useNavigate } from 'react-router-dom'

interface SignUpFormProps extends CommonProps {
    disableSubmit?: boolean
    signInUrl?: string
}

type SignUpFormSchema = {
    name: string
    email: string
    password: string
    confirmPassword: string
}

const validationSchema = Yup.object().shape({
    name: Yup.string()
        .transform((value) => value.trim())
        .required('Please enter your name')
        .test('no-empty-spaces', 'Name cannot be just spaces', 
            value => value.trim().length > 0),
    email: Yup.string()
        .transform((value) => value.trim())
        .email('Invalid email')
        .required('Please enter your email'),
    password: Yup.string()
        .transform((value) => value.trim())
        .required('Please enter your password')
        .test('no-empty-spaces', 'Password cannot be just spaces',
            value => value.trim().length > 0),
    confirmPassword: Yup.string()
        .transform((value) => value.trim())
        .oneOf([Yup.ref('password')], 'Your passwords do not match')
        .test('no-empty-spaces', 'Password cannot be just spaces',
            value => value.trim().length > 0),
})

const SignUpForm = (props: SignUpFormProps) => {
    const { disableSubmit = false, className, signInUrl = '/sign-in' } = props
    const [message, setMessage] = useTimeOutMessage()
    const navigate = useNavigate()

    const onSignUp = async (
        values: SignUpFormSchema,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        setSubmitting(true)
        try {
            // Trim all values before sending to API
            const trimmedValues = {
                name: values.name.trim(),
                email: values.email.trim(),
                password: values.password.trim(),
            }

            const { data } = await httpClient.post(endpoints.auth.signup(), trimmedValues)

            toast.push(
                <Notification title="success" type="success">
                    Account created successfully
                </Notification>,
                {
                    placement: 'top-end',
                }
            )

            navigate(signInUrl)
        } catch (error) {
            const err = error as AxiosError
            if (err.response?.status === 400) {
                toast.push(
                    <Notification title="error" type="danger">
                        Email already exists
                    </Notification>,
                    {
                        placement: 'top-end',
                    }
                )
            } else {
                toast.push(
                    <Notification title="error" type="danger">
                        Something went wrong! Please try again.
                    </Notification>,
                    {
                        placement: 'top-end',
                    }
                )
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
                    name: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    if (!disableSubmit) {
                        onSignUp(values, setSubmitting)
                    } else {
                        setSubmitting(false)
                    }
                }}
            >
                {({ touched, errors, isSubmitting, handleChange, setFieldValue }) => (
                    <Form>
                        <FormContainer>
                            <FormItem
                                label="Name"
                                invalid={errors.name && touched.name}
                                errorMessage={errors.name}
                            >
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="name"
                                    placeholder="Name"
                                    component={Input}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        const value = e.target.value;
                                        setFieldValue('name', value);
                                    }}
                                />
                            </FormItem>
                            <FormItem
                                label="Email"
                                invalid={errors.email && touched.email}
                                errorMessage={errors.email}
                            >
                                <Field
                                    type="email"
                                    autoComplete="off"
                                    name="email"
                                    placeholder="Email"
                                    component={Input}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        const value = e.target.value;
                                        setFieldValue('email', value);
                                    }}
                                />
                            </FormItem>
                            <FormItem
                                label="Password"
                                invalid={errors.password && touched.password}
                                errorMessage={errors.password}
                            >
                                <Field
                                    autoComplete="off"
                                    name="password"
                                    placeholder="Password"
                                    component={PasswordInput}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        const value = e.target.value;
                                        setFieldValue('password', value);
                                    }}
                                />
                            </FormItem>
                            <FormItem
                                label="Confirm Password"
                                invalid={
                                    errors.confirmPassword &&
                                    touched.confirmPassword
                                }
                                errorMessage={errors.confirmPassword}
                            >
                                <Field
                                    autoComplete="off"
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    component={PasswordInput}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        const value = e.target.value;
                                        setFieldValue('confirmPassword', value);
                                    }}
                                />
                            </FormItem>
                            <Button
                                block
                                loading={isSubmitting}
                                variant="solid"
                                type="submit"
                            >
                                {isSubmitting
                                    ? 'Creating Account...'
                                    : 'Sign Up'}
                            </Button>
                            <div className="mt-4 text-center">
                                <span>Already have an account? </span>
                                <ActionLink to={signInUrl}>Sign in</ActionLink>
                            </div>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default SignUpForm