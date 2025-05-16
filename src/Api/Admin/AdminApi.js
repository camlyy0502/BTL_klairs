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
};

export default AdminApi;
