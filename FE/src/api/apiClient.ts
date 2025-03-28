import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
})

apiClient.interceptors.request.use(
  (conf) => {
    console.log('Request: ', conf.method?.toUpperCase(), conf.url, conf.params)
    return conf;
  },
  (err) => {
    console.error('Request Error: ', err);
    return err;
  }
);

apiClient.interceptors.response.use(
  (resp) => {
    console.log('Response: ', resp.status, resp.config.url);
    return resp;
  },
  (err) => {
    console.log('Response Error: ', err);
    return Promise.reject(err);
  }
);

export default apiClient;