import axiosClient from "../AxiosClient";

const DashboardApi = {
  getAllProduct: async () => {
    try {
      const response = await axiosClient.get('/api/v1/products');
      return response;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  getLimitProduct: async (limit = 12, page = 1, category) => {
    try {
      const response = await axiosClient.get('/api/v1/products', {
        params: { limit, page, category },
        withCredentials: true,
      });
      return response;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  
  getDetailProduct: async (id) => {
    try {
      const response = await axiosClient.get(`/api/v1/products/${id}`);
      return response;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  
  listCategories: async () => {
    try {
      const response = await axiosClient.get(`/api/v1/categories`);
      return response;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
};

export default DashboardApi;
