import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { isEmail, isValidPassword } from '../Helpers/regexMatcher';
import { createAccount, SignupData } from '../Redux/Slices/authSlice.reducer';
import { useAppDispatch } from '../Helpers/hooks';
function Signup() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [signupData, setSignupData] = useState({
        username: "",
        email: "",
        password: "",
    });

    function handleUserInput(e) {
        const { name, value } = e.target;
        setSignupData({
            ...signupData,
            [name]: value
        });
    }

    async function createNewAccount(event) {
        event.preventDefault();
        if (!signupData.email || !signupData.password || !signupData.username) {
            toast.error("Please fill all the details");
            return;
        }

        if (signupData.username.length < 5) {
            toast.error("Name should be at least 5 characters long");
            return;
        }

        if (!isEmail(signupData.email)) {
            toast.error("Invalid email address");
            return;
        }

        if (!isValidPassword(signupData.password)) {
            toast.error("Password should be 6 - 16 characters long with at least a number and special character");
            return;
        }

        const userData : SignupData = {
            username: signupData.username,
            email: signupData.email,
            password: signupData.password,
        };

        const response = await dispatch(createAccount(userData));
        if (response?.payload?.success) {
            navigate("/login");
        }

        setSignupData({
            username: "",
            email: "",
            password: "",
        });
    }

    return (
        <div className='flex items-center justify-center min-h-screen bg-gray-100'>
            <div className='w-full max-w-md bg-white p-8 rounded-lg shadow-lg'>
                <h1 className="text-center text-3xl font-bold text-blue-800 mb-6">Create an Account</h1>

                <form noValidate onSubmit={createNewAccount} className='flex flex-col gap-4'>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="username" className='font-semibold text-gray-700'>Username</label>
                        <input
                            type="text"
                            required
                            name="username"
                            id="username"
                            placeholder="Enter your username..."
                            className="bg-gray-100 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={handleUserInput}
                            value={signupData.username}
                        />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="email" className='font-semibold text-gray-700'>Email</label>
                        <input
                            type="email"
                            required
                            name="email"
                            id="email"
                            placeholder="Enter your email..."
                            className="bg-gray-100 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={handleUserInput}
                            value={signupData.email}
                        />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="password" className='font-semibold text-gray-700'>Password</label>
                        <input
                            type="password"
                            required
                            name="password"
                            id="password"
                            placeholder="Enter your password..."
                            className="bg-gray-100 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={handleUserInput}
                            value={signupData.password}
                        />
                    </div>

                    <button type="submit" className='mt-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 rounded-lg transition duration-300'>
                        Create Account
                    </button>

                    <div className="text-center mt-4">
                        <p>Already have an account? <Link to="/login" className='text-blue-600 hover:underline'>Login</Link></p>
                        <p>Continue without signup? <Link to="/" className='text-blue-600 hover:underline'>Waiting Page</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Signup;