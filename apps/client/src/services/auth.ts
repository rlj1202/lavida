import { AxiosResponse } from "axios";

import axiosClient from "./axiosClient";

import { User } from "../schemas/user";

import store from "../store/index";
import { clearAuthInfo, setAuthInfo } from "../store/auth/authSlice";

export interface LoginParams {
  username: string;
  password: string;
}

export interface LoginResponseDTO {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterParams {
  username: string;
  password: string;
  email: string;
}

export interface RegisterResponseDTO {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshParams {
  refreshToken: string;
}

export interface RefreshResponseDTO {
  accessToken: string;
  refreshToken: string;
}

export const authenticate = async (): Promise<User> => {
  const response = await axiosClient.get<User, AxiosResponse<User>>("/auth");

  return response.data;
};

export const login = async (
  loginDTO: LoginParams,
): Promise<LoginResponseDTO> => {
  const response = await axiosClient.post<
    LoginResponseDTO,
    AxiosResponse<LoginResponseDTO>,
    LoginParams
  >("/auth/login", loginDTO);

  store.dispatch(
    setAuthInfo({
      user: response.data.user,
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
    }),
  );

  return response.data;
};

export const logout = async () => {
  const response = await axiosClient.post("/auth/logout");

  store.dispatch(clearAuthInfo());

  return response.data;
};

export const register = async (
  registerParams: RegisterParams,
): Promise<RegisterResponseDTO> => {
  const response = await axiosClient.post<
    RegisterResponseDTO,
    AxiosResponse<RegisterResponseDTO>,
    RegisterParams
  >("/auth/register", registerParams);

  store.dispatch(
    setAuthInfo({
      user: response.data.user,
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
    }),
  );

  return response.data;
};

export const refresh = async (): Promise<RefreshResponseDTO> => {
  const refreshToken = store.getState().auth.refreshToken;

  if (!refreshToken) {
    throw new Error("no refresh token");
  }

  const response = await axiosClient.post<
    RefreshResponseDTO,
    AxiosResponse<RefreshResponseDTO>,
    RefreshParams
  >("/auth/refresh", {
    refreshToken,
  });

  store.dispatch(
    setAuthInfo({
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
    }),
  );

  return response.data;
};

const authService = {
  login,
  logout,
  register,
  refresh,
};

export default authService;
