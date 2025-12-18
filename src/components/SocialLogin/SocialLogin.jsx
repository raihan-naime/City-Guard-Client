import React, { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AiFillApple, AiOutlineGoogle } from "react-icons/ai";
import useAxiosPublic from "../../hooks/useAxiosPublic";

const SocialLogin = () => {
  const { googleSignIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const axiosPublic = useAxiosPublic();

  // Redirect to where they came from or home
  const from = location.state?.from?.pathname || "/";
  const [error, setError] = useState(null);
  const handleGoogleSignIn = () => {
    googleSignIn()
      .then((result) => {
        // user info store in database
        const userInfo = {
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
        };
        axiosPublic.post("/users/sync", userInfo).then((res) => {
          console.log("user data has been stored", res.data);
          navigate(location?.state || "/");
        });

        Swal.fire({
          title: "Google Sign In Successful.",
          showClass: {
            popup: "animate__animated animate__fadeInDown",
          },
          hideClass: {
            popup: "animate__animated animate__fadeOutUp",
          },
        });
        navigate(from, { replace: true });
      })
      .catch((err) => {
        setError(err.message);
      });
  };
  if (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: error,
    });
  }
  return (
    <div className="p-4 w-full pt-0">
      <button
        onClick={handleGoogleSignIn}
        type="button"
        className="flex items-center justify-center py-3 px-4 bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 w-full transition ease-in duration-200 text-center text-base font-semibold shadow-sm rounded-lg button-hover-scale"
      >
        <AiOutlineGoogle size={24} className="text-red-500 mr-2" />
        <span>Sign in with Google</span>
      </button>
      {/* Apple Sign In */}
      {/* <button
                type="button"
                className="flex items-center justify-center py-3 px-4 bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 w-full transition ease-in duration-200 text-center text-base font-semibold shadow-sm rounded-lg button-hover-scale"
              >
                <AiFillApple size={24} className="text-gray-900 mr-2" />
                <span>Sign in with Apple</span>
        </button> */}
    </div>
  );
};

export default SocialLogin;
