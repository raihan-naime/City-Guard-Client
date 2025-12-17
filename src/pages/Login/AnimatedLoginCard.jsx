import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Icons for password visibility
import { AiOutlineGoogle, AiFillApple } from 'react-icons/ai'; // Icons for social login
// import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
import SocialLogin from '../../components/SocialLogin/SocialLogin';
// Custom Tailwind Class Definitions (Add these to your global CSS or in a utility plugin if not using JIT)
// For demonstration, these are descriptive.
/*
.input-focus-glow:focus {
  @apply shadow-lg shadow-blue-500/50;
}
.button-hover-scale:hover {
  @apply scale-[1.03] transition-transform duration-300 ease-in-out;
}
*/

const AnimatedLoginCard = () => {
    const { signIn, googleSignIn } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    
    // Redirect to where they came from or home
    const from = location.state?.from?.pathname || "/";
    const [error, setError] = useState(null);
      const handleLogin = event => {
          event.preventDefault();
          const form = event.target;
          const email = form.email.value;
          const password = form.password.value;
  
          signIn(email, password)
              .then(result => {
                  const user = result.user;
                  Swal.fire({
                      title: 'User Login Successful.',
                      showClass: {
                          popup: 'animate__animated animate__fadeInDown'
                      },
                      hideClass: {
                          popup: 'animate__animated animate__fadeOutUp'
                      }
                  });
                  navigate(from, { replace: true });
              })
              .catch(err => {
                  setError(err.message);
                  Swal.fire({
                      icon: 'error',
                      title: 'Oops...',
                      text: err.message,
                  })
              })
      }

    const handleGoogleSignIn = () => {
        googleSignIn()
            .then(result => {
                Swal.fire({
                    title: 'Google Sign In Successful.',
                    showClass: {
                        popup: 'animate__animated animate__fadeInDown'
                    },
                    hideClass: {
                        popup: 'animate__animated animate__fadeOutUp'
                    }
                });
                navigate(from, { replace: true });
            })
            .catch(err => {
                setError(err.message);
            })
    }


  const [showPassword, setShowPassword] = useState(false);
  const [isHovered, setIsHovered] = useState(false); // State for card hover animation

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };



  return (
    // Outer container for background and centering
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto w-full">
        
        {/* Card Container with Super Animations */}
        <div
          className={`relative px-4 py-10 bg-white mx-auto shadow-2xl rounded-3xl sm:p-10 transition-all duration-500 ease-in-out
                      ${isHovered ? 'shadow-blue-500/70 scale-[1.01]' : 'shadow-gray-400/50'}
                      transform hover:shadow-2xl`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="max-w-md mx-auto">
            
            {/* Logo/Header - Retained existing SVG structure */}
            <div className="flex text-3xl text-black items-center space-x-5 justify-center mb-8">
              {/* NOTE: SVG fill color is black, you might want to change it to match a modern palette */}
              Welcome to CityGuard
              
              
            </div>

            <form onSubmit={handleLogin}>
              {/* Email Input */}
              <div className="mt-5">
                <label className="font-semibold text-sm text-gray-600 pb-1 block" htmlFor="login">
                  E-mail
                </label>
                <input
                  className="border-b-2 border-gray-300 rounded-lg px-3 py-3 mt-1 mb-5 text-base w-full transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-200"
                  type="text"
                  id="login"
                  name="email"
                  required
                />
              </div>

              {/* Password Input with Show/Hide Icon */}
              <div className="mt-5">
                <label className="font-semibold text-sm text-gray-600 pb-1 block" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <input
                    className="border-b-2 border-gray-300 rounded-lg px-3 py-3 mt-1 mb-5 text-base w-full transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-200 pr-10"
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 top-1/2 transform -translate-y-1/2 pr-3 flex items-center text-gray-500 hover:text-blue-600 transition-colors duration-200"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <FaEyeSlash size={20} className="w-5 h-5" />
                    ) : (
                      <FaEye size={20} className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="text-right mb-4">
                <a
                  className="text-sm font-semibold text-gray-500 hover:text-blue-600 cursor-pointer transition-colors duration-200"
                  href="#"
                >
                  Forgot Password?
                </a>
              </div>

              {/* Main Login Button */}
              <div className="mt-5">
                <button
                  type="submit"
                  className="py-3 px-4 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-2 text-white w-full transition ease-in duration-300 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 rounded-lg button-hover-scale"
                >
                  Log in
                </button>
              </div>
            </form>

            {/* Divider and Social Logins */}
            <div className="flex items-center justify-between mt-8">
              <span className="w-1/5 border-b border-gray-300"></span>
              <span className="text-xs text-gray-500 uppercase mx-2">Or sign in with</span>
              <span className="w-1/5 border-b border-gray-300"></span>
            </div>

            <div className="flex flex-col space-y-4 mt-4">
              {/* Google Sign In */}
              
              <SocialLogin></SocialLogin>

              
            </div>

            {/* Sign Up Link */}
            <div className="text-center mt-6">
              <Link
                className="text-sm text-gray-500 uppercase hover:text-blue-600 hover:underline transition-colors duration-200"
                to={'/register'}
              >
                Need an account? Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedLoginCard;