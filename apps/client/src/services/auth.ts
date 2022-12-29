import { AxiosResponse } from "axios";
import axiosClient from "./axiosClient";

export interface LoginParams {
  username: string;
  password: string;
}

export interface LoginResponseDTO {
  // TODO:
  user: any;
  accessToken: string;
  refreshToken: string;
}

export const login = async (loginDTO: LoginParams) => {
  const {
    data: { user, accessToken, refreshToken },
  } = await axiosClient.post<
    LoginResponseDTO,
    AxiosResponse<LoginResponseDTO>,
    LoginParams
  >("/auth/login", loginDTO);

  // TODO: Do something
  // Set user and access token and refresh token

  return;
};

export const logout = async () => {
  return;
};
