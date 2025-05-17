import axiosClient from "../AxiosClient";

const ProductAdminApi = {
    getAllProduct: async () => {
        try {
        const response = await axiosClient.get('/api/admin/products');
        return response;
        } catch (error) {
        console.error('API Error:', error);
        throw error;
        }
    },
    getLimitProduct: async (limit = 12, page = 1) => {
        try {
        const response = await axiosClient.get('/api/admin/products', {
            params: { limit, page },
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
        const response = await axiosClient.get(`/api/admin/products/${id}`);
        return response;
        } catch (error) {
        console.error('API Error:', error);
        throw error;
        }
    },
    createNewProduct: async () => {
        try {
        const response = await axiosClient.post(`/api/admin/products`);
        return response;
        } catch (error) {
        console.error('API Error:', error);
        throw error;
        }
    },
};

export default ProductAdminApi;
