import React, { useContext, useState } from 'react';
import { AuthContext } from '../contacts/AuthProvider';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import googleLogo from "../assets/Google__G__logo.svg";

const SignUp = () => {
    const { createUser, loginWithGoogle } = useContext(AuthContext);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    const from = location.state?.from?.pathname || "/";

    const handleSignUp = async (event) => {
        event.preventDefault();
        setError("");
        setIsLoading(true);

        const form = event.target;
        const email = form.email.value;
        const password = form.password.value;

        // Basic validation
        if (!email || !password) {
            setError("Email and password are required");
            setIsLoading(false);
            return;
        }

        try {
            const userCredential = await createUser(email, password);
            const user = userCredential.user;
            alert("Sign up successful!");
            form.reset();
            navigate(from, { replace: true });
        } catch (error) {
            // Handle specific Firebase auth errors
            switch (error.code) {
                case 'auth/email-already-in-use':
                    setError('This email is already registered. Please login instead.');
                    break;
                case 'auth/invalid-email':
                    setError('Invalid email address.');
                    break;
                case 'auth/weak-password':
                    setError('Password should be at least 6 characters.');
                    break;
                default:
                    setError(error.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignUp = async () => {
        setError("");
        setIsLoading(true);

        try {
            const result = await loginWithGoogle();
            const user = result.user;
            alert("Sign up successful!");
            navigate(from, { replace: true });
        } catch (error) {
            // Handle specific Firebase auth errors for Google sign-in
            switch (error.code) {
                case 'auth/popup-closed-by-user':
                    setError('Sign-in popup was closed before completing.');
                    break;
                case 'auth/popup-blocked':
                    setError('Sign-in popup was blocked by the browser.');
                    break;
                default:
                    setError('An error occurred during Google sign-in. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
            <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                <div
                    className="absolute inset-0 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"
                    style={{ backgroundImage: 'linear-gradient(to bottom right,#f29ad8,#f039b1)' }}
                >
                </div>
                <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                    <div className="max-w-md mx-auto">
                        <div>
                            <h1 className="text-2xl font-semibold">Sign Up Form</h1>
                        </div>
                        <div className="divide-y divide-gray-200">
                            <form onSubmit={handleSignUp} className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                                <div className="relative">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                                        placeholder="Email address"
                                        required
                                    />
                                </div>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                                        placeholder="Password"
                                        required
                                        minLength={6}
                                    />
                                </div>
                                {error && (
                                    <div className="text-red-500 text-sm mt-2">{error}</div>
                                )}
                                <p>
                                    If you already have an account please{' '}
                                    <Link to="/login" className="underline text-pink-500 hover:text-pink-600">
                                        Login
                                    </Link>{' '}
                                    here
                                </p>
                                <div className="relative">
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors disabled:opacity-50"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Signing up...' : 'Sign Up'}
                                    </button>
                                </div>
                            </form>
                        </div>
                        <hr />
                        <div className="flex w-full items-center flex-col mt-5 gap-3">
                            <button
                                onClick={handleGoogleSignUp}
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-pink-200 text-pink-900 rounded-2xl hover:bg-pink-300 transition-colors disabled:opacity-50"
                                disabled={isLoading}
                            >
                                <img src={googleLogo} alt="Google logo" className="w-6 h-6" />
                                {isLoading ? 'Signing up...' : 'Sign up with Google'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;