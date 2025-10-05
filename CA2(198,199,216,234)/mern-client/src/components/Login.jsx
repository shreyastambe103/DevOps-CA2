import React, { useContext, useState } from 'react';
import { AuthContext } from '../contacts/AuthProvider';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import googleLogo from "../assets/Google__G__logo.svg";

const Login = () => {
    const { login, loginWithGoogle } = useContext(AuthContext);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    const from = location.state?.from?.pathname || "/";

    const handleLogin = async (event) => {
        event.preventDefault();
        setError("");
        setIsLoading(true);

        const form = event.target;
        const email = form.email.value;
        const password = form.password.value;

        try {
            const userCredential = await login(email, password);
            const user = userCredential.user;
            alert("Login successful!");
            form.reset();
            // Navigate to dashboard if coming from there
            const destination = location.state?.from?.pathname || '/admin/dashboard';
            navigate(destination, { replace: true });
        } catch (error) {
            switch (error.code) {
                case 'auth/invalid-email':
                    setError('Invalid email address.');
                    break;
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                    setError('Invalid email or password.');
                    break;
                default:
                    setError('Failed to login. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError("");
        setIsLoading(true);

        try {
            const result = await loginWithGoogle();
            const user = result.user;
            alert("Login successful!");
            // Navigate to dashboard if coming from there
            const destination = location.state?.from?.pathname || '/admin/dashboard';
            navigate(destination, { replace: true });
        } catch (error) {
            switch (error.code) {
                case 'auth/popup-closed-by-user':
                    setError('Login popup was closed.');
                    break;
                case 'auth/popup-blocked':
                    setError('Login popup was blocked by the browser.');
                    break;
                default:
                    setError('Failed to login with Google. Please try again.');
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
                            <h1 className="text-2xl font-semibold">Log In</h1>
                        </div>
                        <div className="divide-y divide-gray-200">
                            <form onSubmit={handleLogin} className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
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
                                    />
                                </div>

                                {error && (
                                    <div className="text-red-500 text-sm mt-2">{error}</div>
                                )}

                                <p>
                                    If you don't have an account please{' '}
                                    <Link to="/sign-up" className="text-pink-500 hover:text-pink-600">
                                        Sign up
                                    </Link>{' '}
                                    here
                                </p>
                                <div className="relative">
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors disabled:opacity-50"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Logging in...' : 'Login'}
                                    </button>
                                </div>
                            </form>
                        </div>
                        <hr />
                        <div className="flex w-full items-center flex-col mt-5 gap-3">
                            <button
                                onClick={handleGoogleLogin}
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-pink-200 text-pink-900 rounded-2xl hover:bg-pink-300 transition-colors disabled:opacity-50"
                                disabled={isLoading}
                            >
                                <img src={googleLogo} alt="Google logo" className="w-6 h-6" />
                                {isLoading ? 'Logging in...' : 'Login with Google'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;