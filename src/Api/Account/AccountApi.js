import axiosClient from "../AxiosClient";

const AccountApi = {
  register: async (data) => {
    try {
      const response = await axiosClient.post('/api/register', JSON.stringify(data));
      return response;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  login: async (data) => {
    try {
      const response = await axiosClient.post('/api/login', JSON.stringify(data));
      return response;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  logout: async () => {
    try {
      const response = await axiosClient.post('/api/logout');
      return response;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  info: async () => {
    try {
      const response = await axiosClient.get('/api/v1/info');
      return response;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  chatHistoty: async () => {
    try {
      const response = await axiosClient.get('/api/v1/chat/history');
      return response;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
};

export default AccountApi;
