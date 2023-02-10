import { Contest } from "../schemas/contest";
import { PaginationResponse } from "../schemas/pagination-response";
import axiosClient from "./axiosClient";

export const getContests = async (): Promise<PaginationResponse<Contest>> => {
  const response = await axiosClient.get<PaginationResponse<Contest>>(
    "/contests",
  );
  return response.data;
};

export const getContest = async (id: string | number): Promise<Contest> => {
  const response = await axiosClient.get<Contest>(`/contests/${id}`);

  return response.data;
};
