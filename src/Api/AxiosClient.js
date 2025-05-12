import axios from "axios";
// import queryString from "query-string";

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API,
  headers: {
    "content-type": "application/json",
  },
  withCredentials: true,
});

axiosClient.interceptors.request.use(async (config) => {
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      // You might want to redirect to login page here
      // window.location.href = '/login';
    }
    throw error;
  }
);

export default axiosClient;
