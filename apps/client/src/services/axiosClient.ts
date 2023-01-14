import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { ClientRequest } from "http";

import store from "../store/index";
import { logout } from "../store/auth/authSlice";
import Router from "next/router";

// const baseURL = "http://localhost:3100/api";
const baseURL = "http://localhost:3100";
const client = axios.create({ baseURL });

const withAccessToken = (config: AxiosRequestConfig) => {
  if (!config.headers) return config;

  const { accessToken } = store.getState().auth;

  if (accessToken) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${accessToken}`,
    };
  }

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

      if (status === 401) {
        store.dispatch(logout());
        Router.push("/auth/login");
      } else if (status === 404) {
        Router.push("/");
      }

      throw response.data;
    }

    throw error;
  }
);

export default client;
