import axios from 'axios';
import history from './history';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

api.interceptors.request.use(config => {
  config.headers.authorization = `Bearer ${localStorage.getItem(
    '@Umbriel:token',
  )}`;

  return config;
});

api.interceptors.response.use(
  config => config,
  error => {
    const { data } = error.response;

    if (data?.code === 'token.expired') {
      localStorage.clear();

      history.push('/');
    }
  },
);

export default api;
