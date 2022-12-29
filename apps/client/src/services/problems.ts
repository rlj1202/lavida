import axiosClient from "./axiosClient";

// TODO:
interface Problem {}

export const getProblems = async (): Promise<Problem[]> => {
  const response = await axiosClient.get<Problem[]>(`/problems`);
  return response.data;
};

export const getProblem = async (id: number): Promise<Problem> => {
  const response = await axiosClient.get<Problem>(`/problems/${id}`);
  return response.data;
};
