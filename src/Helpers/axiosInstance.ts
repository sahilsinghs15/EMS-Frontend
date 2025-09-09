import axios from "axios";

const base_url = "http://localhost:5000/api";
const axiosInstance = axios.create();
axiosInstance.defaults.baseURL = base_url;
axiosInstance.defaults.withCredentials = true;

export default axiosInstance;
