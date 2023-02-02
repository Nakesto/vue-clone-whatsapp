import axios from "axios";

const baseurl = process.env.BACKEND_URL;

const axiosInstance = axios.create({
  withCredentials: false,
  baseURL: baseurl,
});

export default axiosInstance;
