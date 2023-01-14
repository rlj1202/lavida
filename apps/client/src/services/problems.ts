import { AxiosResponse } from "axios";
import axiosClient from "./axiosClient";

import { Problem } from "../schemas/problem";
import { PaginationResponse } from "../schemas/pagination-response";
import { PaginationOptions } from "../schemas/pagination-options";

export const getProblems = async (
  options: PaginationOptions
): Promise<PaginationResponse<Problem>> => {
  const response = await axiosClient.get<
    PaginationResponse<Problem>,
    AxiosResponse<PaginationResponse<Problem>>
  >(`/problems`, { params: options });

  return response.data;
};

export const getProblem = async (id: number): Promise<Problem> => {
  const response = await axiosClient.get<Problem>(`/problems/${id}`);
  return response.data;
};

export const searchProblems = async (
  options: PaginationOptions & { query: string }
): Promise<PaginationResponse<Problem>> => {
  const response = await axiosClient.get<
    PaginationResponse<Problem>,
    AxiosResponse<PaginationResponse<Problem>>
  >("/problems/search", { params: options });

  return response.data;
};
