import { AxiosResponse } from "axios";
import { PaginationOptions } from "../schemas/pagination-options";
import { PaginationResponse } from "../schemas/pagination-response";
import { Submission } from "../schemas/submission";
import axiosClient from "./axiosClient";

export interface SubmitParams {
  problemId: number;
  language: string;
  code: string;
}

export interface SubmitResponseDTO extends Submission {}

export const getSubmissions = async (
  options: PaginationOptions & {
    username?: string;
    problemId?: number | string;
  }
): Promise<PaginationResponse<Submission>> => {
  const response = await axiosClient.get<
    PaginationResponse<Submission>,
    AxiosResponse<PaginationResponse<Submission>>
  >("/submissions", { params: options });

  return response.data;
};

export const submit = async (
  submitParams: SubmitParams
): Promise<SubmitResponseDTO> => {
  const response = await axiosClient.post<
    SubmitResponseDTO,
    AxiosResponse<SubmitResponseDTO>,
    SubmitParams
  >("/submissions", submitParams);

  return response.data;
};
