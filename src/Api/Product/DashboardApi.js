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
};

export default DashboardApi;
