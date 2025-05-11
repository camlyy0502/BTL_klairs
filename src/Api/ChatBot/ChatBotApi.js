import axiosClient from "../AxiosClient";

const ChatBotApi = {
  getChat: async (query) => {
    try {
      const response = await axiosClient.post('/api/v1/chatbot/query', JSON.stringify(query));
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
};

export default ChatBotApi;
