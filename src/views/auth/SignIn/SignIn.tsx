import SignInForm from './SignInForm'
import VersionSelector from './VersionSelector'

const SignIn = () => {
    return (
        <>
        <div className="mb-8">
            {/* <VersionSelector /> */}
            <h3 className="mb-1">Welcome back!</h3>
            <p>Please enter your credentials to sign in!</p>
        </div>
        <SignInForm disableSubmit={false} />
        </>
    )
}

export default SignIn
