import axiosClient from "../AxiosClient";

const BotScenariosApi = {
    listBotScenarios: async () => {
        try {
            const response = await axiosClient.get('/api/admin/bot_scenarios');
            return response;
        } catch (error) {
            console.error('API Error:', error);
        throw error;
        }
    },
    createBotScenarios: async (body) => {
        try {
            const response = await axiosClient.post('/api/admin/bot_scenarios', body);
            return response;
        } catch (error) {
            console.error('API Error:', error);
        throw error;
        }
    },
    updateBotScenario: async (id, body) => {
        try {
            const response = await axiosClient.put(`/api/admin/bot_scenarios/${id}`, body);
            return response;
        } catch (error) {
            console.error('API Error:', error);
        throw error;
        }
    },
    deleteBotScenario: async (id) => {
        try {
            const response = await axiosClient.delete(`/api/admin/bot_scenarios/${id}`);
            return response;
        } catch (error) {
            console.error('API Error:', error);
        throw error;
        }
    },
    activeBotScenario: async (id) => {
        try {
            const response = await axiosClient.delete(`/api/admin/bot_scenarios/${id}/activate`);
            return response;
        } catch (error) {
            console.error('API Error:', error);
        throw error;
        }
    },
    deactiveBotScenario: async (id) => {
        try {
            const response = await axiosClient.delete(`/api/admin/bot_scenarios/${id}/deactivate`);
            return response;
        } catch (error) {
            console.error('API Error:', error);
        throw error;
        }
    },
}

export default BotScenariosApi;