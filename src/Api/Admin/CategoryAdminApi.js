import axiosClient from "../AxiosClient";

const CategoryAdminApi = {
    getCategories: async () => {
        try {
            const response = await axiosClient.get('/api/admin/categories');
            return response;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    createCategory: async (data) => {
        try {
            const response = await axiosClient.post('/api/admin/categories', data);
            return response;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    updateCategory: async (id, data) => {
        try {
            const response = await axiosClient.put(`/api/admin/categories/${id}`, data);
            return response;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    deleteCategory: async (id) => {
        try {
            const response = await axiosClient.delete(`/api/admin/categories/${id}`);
            return response;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
};

export default CategoryAdminApi;
