import axios from "axios";

const baseurl = import.meta.env.VITE_BACKEND_URL

const axiosInstance = axios.create({
    withCredentials: false,
    baseURL: baseurl
});

export default axiosInstance;