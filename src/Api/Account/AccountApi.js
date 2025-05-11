import axiosClient from "../AxiosClient";

const AccountApi = {
  register: async (data) => {
    try {
      const response = await axiosClient.post('/api/v1/register', JSON.stringify(data));
      return response;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  login: async (data) => {
    try {
      const response = await axiosClient.post('/api/v1/login', JSON.stringify(data));
      return response;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  logout: async (data) => {
    try {
      const response = await axiosClient.post('/api/v1/logout', JSON.stringify(data));
      return response;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
};

export default AccountApi;
