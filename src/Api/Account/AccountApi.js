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
  logout: async (data) => {
    try {
      const response = await axiosClient.post('/api/logout', JSON.stringify(data));
      return response;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  info: async (data) => {
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
  getAddresses: async () => {
    try {
      const response = await axiosClient.get('/api/v1/addresses');
      return response;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  addAddress: async (data) => {
    try {
      const response = await axiosClient.post('/api/v1/addresses', data);
      return response;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  updateAddress: async (data) => {
    try {
      const response = await axiosClient.put(`/api/v1/addresses/${data.id}`, data);
      return response;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  deleteAddress: async (id) => {
    try {
      const response = await axiosClient.delete(`/api/v1/addresses/${id}`);
      return response;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  setDefaultAddress: async (id) => {
    try {
      const response = await axiosClient.post(`/api/v1/addresses/${id}/default`);
      return response;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
};

export default AccountApi;
