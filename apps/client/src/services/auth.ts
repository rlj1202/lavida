import { AxiosResponse } from "axios";

import axiosClient from "./axiosClient";

import { User } from "../schemas/user";
import { setAccessToken, setUser } from "../store/auth/authSlice";
import store from "../store/index";

export interface LoginParams {
  username: string;
  password: string;
}

export interface LoginResponseDTO {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export const login = async (
  loginDTO: LoginParams
): Promise<LoginResponseDTO> => {
  const response = await axiosClient.post<
    LoginResponseDTO,
    AxiosResponse<LoginResponseDTO>,
    LoginParams
  >("/auth/login", loginDTO);

  store.dispatch(setUser(response.data.user));
  store.dispatch(setAccessToken(response.data.accessToken));

  return response.data;
};

export const logout = async () => {
  return;
};
