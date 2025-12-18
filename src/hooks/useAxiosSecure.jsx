import axios from "axios";
// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import useAuth from "./useAuth";

const axiosSecure = axios.create({
    baseURL: 'http://localhost:5000'
});

const useAxiosSecure = () => {
    // We need useAuth hook first, but assuming we have it or will create it. 
    // Implementing interceptor later to avoid circular dependency in AuthProvider if we use it there.
    // For now basic setup.
    
    // Add request interceptor
    axiosSecure.interceptors.request.use(function (config) {
        const token = localStorage.getItem('access-token');
        if(token) {
            config.headers.authorization = `Bearer ${token}`;
        }
        return config;
    }, function (error) {
        return Promise.reject(error);
    });

    // Add response interceptor (401/403 handling)
    axiosSecure.interceptors.response.use(function (response) {
        return response;
    }, async (error) => {
        const status = error.response ? error.response.status : null;
        if(status === 401 || status === 403) {
            // Logout and redirect?
            // await logOut();
            // navigate('/login');
        }
        return Promise.reject(error);
    })

    return axiosSecure;
};

export default useAxiosSecure;
