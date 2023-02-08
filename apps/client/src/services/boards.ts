import { AxiosResponse } from "axios";

import { Board } from "../schemas/board";

import axiosClient from "./axiosClient";

export interface CreateBoardParams {
  name: string;
  title: string;
  description: string;
}

export interface UpdateBoardParams {
  name?: string;
  title?: string;
  description?: string;
}

export const getBoards = async (): Promise<Board[]> => {
  const response = await axiosClient.get<Board[]>("/boards");

  return response.data;
};

export const getBoardById = async (id: number): Promise<Board> => {
  const response = await axiosClient.get<Board, AxiosResponse<Board>>(
    `/boards/${id}`,
  );

  return response.data;
};

export const getBoardByName = async (name: string): Promise<Board> => {
  const response = await axiosClient.get<Board>(`/boards/name/${name}`);

  return response.data;
};

export const createBoard = async (
  createBoardDto: CreateBoardParams,
): Promise<Board> => {
  const response = await axiosClient.post<
    Board,
    AxiosResponse<Board>,
    CreateBoardParams
  >("/boards", createBoardDto);

  return response.data;
};

export const updateBoard = async (
  updateBoardDto: UpdateBoardParams,
): Promise<Board> => {
  const response = await axiosClient.patch<
    Board,
    AxiosResponse<Board>,
    UpdateBoardParams
  >(`/boards/name/${updateBoardDto.name}`, updateBoardDto);

  return response.data;
};
