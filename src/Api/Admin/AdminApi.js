import axiosClient from "../AxiosClient";

const AdminApi = {
  chatHistoty: async (email) => {
    try {
      const response = await axiosClient.get('/api/admin/chat/history',
        {params: {email},}
      );
      return response;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  listAccount: async () => {
    try {
      const response = await axiosClient.get('/api/admin/accounts');
      return response;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  getAccountById: async (id) => {
    try {
      const response = await axiosClient.get(`/api/admin/accounts/${id}`);
      return response;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  listRoles: async () => {
    try {
      const response = await axiosClient.get('/api/admin/roles');
      return response;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  listUserHaveChat: async () => {
    try {
      const response = await axiosClient.get('/api/admin/accounts/with-chat-history');
      return response;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  listAddressAdmin: async (email) => {
    try {
      const response = await axiosClient.get('/api/admin/addresses', {
        params: { email },
      });
      return response;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  changeRoleUser: async (id, body) => {
    try {
      const response = await axiosClient.put(`/api/admin/accounts/${id}/roles`, body);
      return response;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  createAccount: async (body) => {
    try {
      const response = await axiosClient.post('/api/admin/accounts', body);
      return response;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  deleteAccount: async (id) => {
    try {
      const response = await axiosClient.delete(`/api/admin/accounts/${id}`);
      return response;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  reportStats: async (
    startDate,
    endDate
  ) => {
    try {
      const response = await axiosClient.get('/api/admin/reports/stats', {
        params: {
          startDate,
          endDate,
        },
      });
      return response;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
};

export default AdminApi;
