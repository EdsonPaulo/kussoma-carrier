import axios from 'axios';

const API_URL = 'https://vast-atoll-02175.herokuapp.com/api';
//const API_URL = 'http://192.168.27.1/pombo-coreio/api'

const api = token => {
  if (token) {
    return axios.create({
      baseURL: API_URL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  return axios.create({ baseURL: API_URL });
};
export default api;
