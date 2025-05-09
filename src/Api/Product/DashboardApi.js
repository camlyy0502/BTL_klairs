import axiosClient from "../AxiosClient";
// import AxiosClient from "../AxiosClient";

const DashboardApi = {
  getAllProduct: async () => {
    try {
      const response = await axiosClient.get('/products');
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  getLimitProduct: async (limit = 12, page = 1) => {
    try {
      const response = await axiosClient.get('/products', {
        params: { limit, page }
      });
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  
  getDetailProduct: async (id) => {
    try {
      const response = await axiosClient.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
};

export default DashboardApi;
