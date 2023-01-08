import { UserProblem } from "../schemas/user-problem";
import axiosClient from "./axiosClient";

export const getUserProblems = async (
  userId: number
): Promise<UserProblem[]> => {
  const userProblems = await axiosClient.get<UserProblem[]>(
    `/user-problems/${userId}`
  );

  return userProblems.data;
};
