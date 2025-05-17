import axiosClient from "../AxiosClient";

const OrderAdminApi = {
    getAllOrder: async () => {
        try {
        const response = await axiosClient.get('/api/admin/orders');
        return response;
        } catch (error) {
        console.error('API Error:', error);
        throw error;
        }
    },
    getOrderDetail: async (id) => {
        try {
        const response = await axiosClient.get(`/api/admin/orders/${id}`);
        return response;
        } catch (error) {
        console.error('API Error:', error);
        throw error;
        }
    },
};

export default OrderAdminApi;
