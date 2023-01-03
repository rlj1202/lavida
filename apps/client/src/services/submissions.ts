import { AxiosResponse } from "axios";
import { Submission } from "../schemas/submission";
import axiosClient from "./axiosClient";

export interface SubmitParams {
  problemId: number;
  language: string;
  code: string;
}

export interface SubmitResponseDTO extends Submission {}

export const getSubmission = async (): Promise<Submission> => {
  throw new Error("not implemented");
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
