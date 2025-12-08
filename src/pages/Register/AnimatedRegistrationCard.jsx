import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Password icons
import {
  AiOutlineUser,
  AiOutlineCloudUpload,
  AiOutlineMail,
} from "react-icons/ai"; // General icons
import { Link } from "react-router-dom";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import Swal from "sweetalert2";

// --- Start of Component ---
const AnimatedRegistrationCard = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [fileName, setFileName] = useState("No file selected"); // State for photo file name
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

  const handleFileChange = (e) => {
    // Simplified file handling for UI demonstration
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName("No file selected");
    }
  };

  const onSubmit = (data) => {
    createUser(data.email, data.password)
      .then((result) => {
        const loggedUser = result.user;
        updateUserProfile(data.name, data.photoURL)
          .then(() => {
            // Creates user entry in database
            const userInfo = {
              name: data.name,
              email: data.email,
              photoURL: data.photoURL,
              role: "citizen", // default
            };
            axiosPublic.post("/users/sync", userInfo).then((res) => {
              if (res.data) {
                // Check if user was returned/sync'd
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
        {/* Card Container with Super Animations (Glassmorphism inspired light theme) */}
        <div
          className={`relative px-4 py-10 bg-white mx-auto shadow-2xl rounded-3xl sm:p-10 transition-all duration-500 ease-in-out
                      ${
                        isHovered
                          ? "shadow-green-500/70 scale-[1.01]"
                          : "shadow-gray-400/50"
                      }
                      transform hover:shadow-2xl`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="max-w-md mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
              Create Account
            </h2>

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* 1. Name Input */}
              <div className="mt-5">
                <label
                  className="font-semibold text-sm text-gray-600 pb-1 flex items-center"
                  htmlFor="name"
                >
                  <AiOutlineUser size={16} className="mr-1 text-gray-500" />{" "}
                  Full Name
                </label>
                <input
                  className="border-b-2 border-gray-300 rounded-lg px-3 py-3 mt-1 mb-5 text-base w-full transition-all duration-300 focus:border-green-500 focus:outline-none focus:ring-4 focus:ring-green-200"
                  type="text"
                  {...register("name", { required: true })}
                  id="name"
                  name="name"
                  placeholder="Name"
                  
                />
                {errors.name && (
                  <span className="text-red-600">Name is required</span>
                )}
              </div>

              {/* 2. Photo Upload Field (Custom Styled) */}
              <div className="mt-5 mb-5">
                <label
                  className="font-semibold text-sm text-gray-600 pb-1 flex items-center"
                  htmlFor="photo-upload"
                >
                  <AiOutlineCloudUpload
                    size={16}
                    className="mr-1 text-gray-500"
                  />{" "}
                  Profile Photo
                </label>
                <div className="flex items-center space-x-3">
                  {/* Hidden file input */}
                  <input
                    type="file"
                    {...register("photoURL", { required: true })}
                    id="photo-upload"
                    name="photo"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {/* Custom styled button to trigger file input */}
                  <label
                    htmlFor="photo-upload"
                    className="py-2 px-4 bg-gray-200 hover:bg-gray-300 transition-colors duration-200 text-gray-700 text-sm font-semibold rounded-lg cursor-pointer flex-shrink-0"
                  >
                    Choose File
                  </label>
                  {/* Display selected file name */}
                  <p
                    className="text-sm text-gray-500 truncate"
                    title={fileName}
                  >
                    {fileName}
                  </p>
                  {errors.photoURL && (
                    <span className="text-red-600">Photo URL is required</span>
                  )}
                </div>
              </div>

              {/* 3. Email Input */}
              <div className="mt-5">
                <label
                  className="font-semibold text-sm text-gray-600 pb-1 flex items-center"
                  htmlFor="email"
                >
                  <AiOutlineMail size={16} className="mr-1 text-gray-500" />{" "}
                  E-mail
                </label>
                <input
                  className="border-b-2 border-gray-300 rounded-lg px-3 py-3 mt-1 mb-5 text-base w-full transition-all duration-300 focus:border-green-500 focus:outline-none focus:ring-4 focus:ring-green-200"
                  type="email"
                  {...register("email", { required: true })}
                  id="email"
                  name="email"
                  
                />
                {errors.email && (
                  <span className="text-red-600">Email is required</span>
                )}
              </div>

              {/* 4. Password Input with Show/Hide Icon */}
              <div className="mt-5">
                <label
                  className="font-semibold text-sm text-gray-600 pb-1 block"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    className="border-b-2 border-gray-300 rounded-lg px-3 py-3 mt-1 mb-5 text-base w-full transition-all duration-300 focus:border-green-500 focus:outline-none focus:ring-4 focus:ring-green-200 pr-10"
                    type={showPassword ? "text" : "password"}
                    {...register("password", {
                      required: true,
                      minLength: 6,
                      maxLength: 20,
                      pattern:
                        /(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z])/,
                    })}
                    id="password"
                    name="password"
                    
                  />
                  {errors.password?.type === "required" && (
                    <p className="text-red-600">Password is required</p>
                  )}
                  {errors.password?.type === "minLength" && (
                    <p className="text-red-600">
                      Password must be 6 characters
                    </p>
                  )}
                  {errors.password?.type === "maxLength" && (
                    <p className="text-red-600">
                      Password must be less than 20 characters
                    </p>
                  )}
                  {errors.password?.type === "pattern" && (
                    <p className="text-red-600">
                      Password must have one Uppercase one lower case, one
                      number and one special character.
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 top-1/2 transform -translate-y-1/2 pr-3 flex items-center text-gray-500 hover:text-green-600 transition-colors duration-200"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <FaEyeSlash size={20} className="w-5 h-5" />
                    ) : (
                      <FaEye size={20} className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
              {/* Register Button */}
              <div className="mt-5">
                <button
                  type="submit"
                  className="py-3 px-4 bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-2 text-white w-full transition ease-in duration-300 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 rounded-lg button-hover-scale"
                >
                  Create My Account
                </button>
              </div>
            </form>

            {/* Login Link */}
            <div className="text-center mt-6">
              <span className="text-sm text-gray-500 mr-1">
                Already have an account?
              </span>
              <Link
                className="text-sm font-semibold text-green-600 hover:text-green-700 hover:underline transition-colors duration-200"
                to={"/login"}
              >
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
