import { AxiosResponse } from "axios";
import { User } from "../schemas/user";
import axiosClient from "./axiosClient";

export const getUser = async (username: string): Promise<User> => {
  const response = await axiosClient.get<User, AxiosResponse<User>>(
    `/users/${username}`
  );

  return response.data;
};
