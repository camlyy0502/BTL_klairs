import axiosClient from "../AxiosClient";

const OrderAdminApi = {
    getAllOrder: async (startDate, endDate) => {
        try {
            const response = await axiosClient.get('/api/admin/orders',
                {
                    params: {
                    startDate,
                    endDate,
                    }
                }
            );
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
    createOrderDetail: async (body) => {
        try {
            const response = await axiosClient.post(`/api/admin/orders`, body);
            return response;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },
    updateOrderStatus: async (id, status) => {
        try {
            const response = await axiosClient.put(`/api/admin/orders/${id}/status`, { status });
            return response;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },
    updateOrder: async (id, body) => {
        try {
            const response = await axiosClient.put(`/api/admin/orders/${id}`, body);
            return response;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },
};

export default OrderAdminApi;
