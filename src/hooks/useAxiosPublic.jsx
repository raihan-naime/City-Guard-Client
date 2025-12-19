import axios from "axios";

const axiosPublic = axios.create({
    baseURL: 'https://city-guard-server-liard.vercel.app' // or from env
});

const useAxiosPublic = () => {
    return axiosPublic;
};

export default useAxiosPublic;  
 