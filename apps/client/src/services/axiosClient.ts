import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { ClientRequest } from "http";

const baseURL = "/api";
const client = axios.create({ baseURL });

const withAccessToken = (config: AxiosRequestConfig) => {
  if (!config.headers) return config;

  const accessToken = localStorage.getItem("access_token");

  config.headers = {
    ...config.headers,
    Authorization: `Bearer ${accessToken}`,
  };

  return config;
};

client.interceptors.request.use(withAccessToken);

client.interceptors.response.use(
  (config) => config,
  async (error: {
    response?: AxiosResponse;
    request?: ClientRequest;
    message?: string;
    config?: any;
  }) => {
    const { response } = error;

    if (response) {
      const { status } = response;

      // TODO: Do something
      if (status === 401 || status === 404) {
        // TODO: Do something
        // Get refresh token or do logout or redirect to login page or something
      }

      throw response.data;
    }

    throw error;
  }
);

export default client;
