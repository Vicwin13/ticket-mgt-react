import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

import api from '../api/axios';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      toast.error('All fields are required');
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      const usersResponse = await api.get('/api/users');
      const user = usersResponse.data.find((u) => u.email === email);

      if (user && user.password === password) {
        console.log('Login successful for:', email);
        localStorage.setItem('auth_token', user.token || 'mock-token');
        localStorage.setItem('user_id', user.id);
        localStorage.setItem(
          'user_name',
          `${user.firstName || user.name || ''}`.trim() || user.email,
        );
        toast.success('Login successful');
        navigate('/dashboard');
      } else {
        toast.error('Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Something went wrong, Please try again');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <section className="flex justify-content align-center h-screen">
      <div className="w-full bg-pink-500 h-full flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">This is the image part</h2>
        </div>
      </div>

      <div className="w-full bg-[#f7f7f7] h-full flex items-center justify-center">
      <div className="bg-[#fff] p-[2rem] rounded-[8px] w-full max-w-[350px]">
          <div className="mb-[2rem] ">
            <h2 className=" font-semibold text-[#333] m-[0px] ">Login</h2>
            <p className="text-[12px] text-[#333] leading-[20px] m-[0px]">Transform your chaotic schedules into organized tickets</p>
          </div>
          
          <form onSubmit={handleLogin}>
            <div className="mb-[.5rem]">
              <label htmlFor="email" className="block mb-0 font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-[93.5%] p-[0.75rem] text-[1rem] border border-[#ddd] rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="mb-2 relative">
              <label htmlFor="password" className="block mb-0 font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-[93.5%] p-[0.75rem] text-[1rem] border border-[#ddd]  rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  className="absolute right-[4px] top-1/2 transform border-0 bg-[#fff] -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={togglePasswordVisibility}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path
                        d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                      ></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full p-[0.75rem] mt-[20px] bg-[#0066ff] cursor-pointer text-[1rem] hover:bg-[#0052cc] text-[#fff] font-medium py-3 px-4 rounded-[4px] border-0 transition-colors disabled:bg-blue-400"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          
          <p className="mt-5 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 hover:underline font-medium">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;