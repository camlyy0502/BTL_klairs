import axiosClient from "../AxiosClient";

const CartApi = {
    createOrder: async (data) => {
      try {
        const response = await axiosClient.post('/api/v1/orders', data);
        return response;
      } catch (error) {
        console.error('API Error:', error);
        throw error;
      }
    },
    getOrders: async () => {
      try {
        const response = await axiosClient.get('/api/v1/orders');
        return response;
      } catch (error) {
        console.error('API Error:', error);
        throw error;
      }
    },
    getOrderDetail: async (id) => {
      try {
        const response = await axiosClient.get(`/api/v1/orders/${id}`);
        return response;
      } catch (error) {
        console.error('API Error:', error);
        throw error;
      }
    },
};

export default CartApi;
