import axios from 'axios'

const axiosInstance = axios.create();

axiosInstance.defaults.baseURL = `${import.meta.env.VITE_API_BASE_URL}/api/v1/`;

axiosInstance.defaults.withCredentials = true;

export default axiosInstance;
