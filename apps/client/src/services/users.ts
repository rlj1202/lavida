import { AxiosResponse } from "axios";
import { User } from "../schemas/user";
import axiosClient from "./axiosClient";

interface UserInfoDTO {
  username: string;
  email: string;
  submissionCount: number;
  acceptCount: number;
  problems: { problemId: number; solved: boolean }[];
}

export const getUser = async (username: string): Promise<UserInfoDTO> => {
  const response = await axiosClient.get<
    UserInfoDTO,
    AxiosResponse<UserInfoDTO>
  >(`/users/${username}`);

  return response.data;
};
