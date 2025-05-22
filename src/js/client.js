import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,

});

const client = {
  async get(uri) {
    try {
      const response = await axiosInstance.get(uri);
      return response.data;
    } catch (err) {
      console.error('Erreur dans client.get():', err);
      throw new Error(err?.response?.data?.message || 'Erreur lors de la requête GET');
    }
  },

  async post(uri, data) {
    try {
      const response = await axiosInstance.post(uri, data);
      return response.data;
    } catch (err) {
      console.error('Erreur dans client.post():', err);
      throw new Error(err?.response?.data?.message || 'Erreur lors de la requête POST');
    }
  },
};

export default client;
