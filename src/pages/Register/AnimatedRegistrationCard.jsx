import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { AiOutlineUser, AiOutlineMail } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import Swal from "sweetalert2";
import SocialLogin from "../../components/SocialLogin/SocialLogin";

// --- Start of Component ---
const AnimatedRegistrationCard = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { createUser, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();
  const [error, setError] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = (data) => {
    createUser(data.email, data.password)
      .then((result) => {
        const loggedUser = result.user;
        console.log(loggedUser);

        updateUserProfile(data.name)
          .then(() => {
            const userInfo = {
              name: data.name,
              email: data.email,
              role: "citizen",
            };

            axiosPublic.post("/users/sync", userInfo).then((res) => {
              if (res.data) {
                reset();
                Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: "User created successfully.",
                  showConfirmButton: false,
                  timer: 1500,
                });
                navigate("/");
              }
            });
          })
          .catch((error) => setError(error.message));
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto w-full">
        <div
          className={`relative px-4 py-10 bg-white mx-auto shadow-2xl rounded-3xl sm:p-10 transition-all duration-500 ease-in-out
            ${
              isHovered
                ? "shadow-gray-400/70 scale-[1.01]"
                : "shadow-gray-400/50"
            }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="max-w-md mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
              Create Account
            </h2>

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Name */}
              <div className="mt-5">
                <label className="font-semibold text-sm text-gray-600 pb-1 flex items-center">
                  <AiOutlineUser size={16} className="mr-1" /> Full Name
                </label>
                <input
                  type="text"
                  {...register("name", { required: true })}
                  className="border-b-2 text-black w-full px-3 py-3 mb-5"
                />
                {errors.name && (
                  <span className="text-red-600">Name is required</span>
                )}
              </div>

              {/* Email */}
              <div className="mt-5">
                <label className="font-semibold text-sm text-gray-600 pb-1 flex items-center">
                  <AiOutlineMail size={16} className="mr-1" /> E-mail
                </label>
                <input
                  type="email"
                  {...register("email", { required: true })}
                  className="border-b-2 text-black w-full px-3 py-3 mb-5"
                />
                {errors.email && (
                  <span className="text-red-600">Email is required</span>
                )}
              </div>

              {/* Password */}
              <div className="mt-5">
                <label className="font-semibold text-sm text-gray-600 pb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password", {
                      required: true,
                      minLength: 6,
                      maxLength: 20,
                      pattern:
                        /(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z])/,
                    })}
                    className="border-b-2 w-full text-black px-3 py-3 mb-5 pr-10"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute text-black right-3 top-3"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                className="py-3 bg-green-600 text-white w-full rounded-lg"
              >
                Create My Account
              </button>
            </form>

            <div className="mt-3">
              <SocialLogin />
            </div>

            <div className="text-center mt-6">
              <span className="text-sm text-gray-500 mr-1">
                Already have an account?
              </span>
              <Link to="/login" className="text-green-600 font-semibold">
                Log In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedRegistrationCard;
