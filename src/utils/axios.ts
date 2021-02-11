import axios, { AxiosResponse } from 'axios';

import { UserResponse } from '../types/ApiReponse';

const publicFetch = axios.create({ baseURL: process.env.REACT_APP_API_URL });
const privateFetch = axios.create({ baseURL: process.env.REACT_APP_API_URL, withCredentials: true });

const setUpAuthInterceptors = (loginWithToken: () => AxiosResponse<UserResponse>) => {
  privateFetch.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response.status !== 401) return Promise.reject(error);
      publicFetch
        .get('auth/refresh-token', { withCredentials: true })
        .then(() => {
          return loginWithToken();
        })
        .catch((err) => err);
    },
  );
};

export { publicFetch, privateFetch, setUpAuthInterceptors };
