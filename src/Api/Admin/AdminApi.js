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
};

export default AdminApi;
