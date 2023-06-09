import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { ClientRequest } from 'http';
import Router from 'next/router';
import HttpStatus from 'http-status';

import store from '../store/index';
import { refresh } from './auth';
import { clearAuthInfo } from '../store/auth/authSlice';

const serverURL = 'http://localhost:3100';
const suffixURL = '';
const axiosClient = axios.create({ baseURL: `${serverURL}${suffixURL}` });

const withAccessToken = (config: InternalAxiosRequestConfig) => {
  const { accessToken } = store.getState().auth;

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
};

axiosClient.interceptors.request.use(withAccessToken);

axiosClient.interceptors.response.use(
  (config) => config,
  async (error: {
    response?: AxiosResponse;
    request?: ClientRequest;
    message?: string;
    config?: AxiosRequestConfig<any>;
  }) => {
    const { response, config: originalConfig } = error;

    if (response) {
      const { status } = response;

      if (status === HttpStatus.UNAUTHORIZED) {
        try {
          await refresh();

          console.log('The access token has been refreshed.');

          if (originalConfig) {
            return axiosClient(originalConfig);
          }

          // TODO: What should i return in this case?
          return;
        } catch (err) {
          // Don't call another axios request again to solve the error.
          // This can lead to infinite loop of requests.
          store.dispatch(clearAuthInfo());

          Router.push('/auth/login');

          return Promise.reject(`Failed to refresh token: ${err}`);
        }
      } else if (status === HttpStatus.NOT_FOUND) {
        Router.push('/');
      }
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
