import { AxiosResponse } from "axios";
import isServerSide from "../utils/isServerSide";
import axiosClient from "./axiosClient";

interface Board {}

export interface GetBoardParams {
  slug: string;
}

export interface CreateBoardParams {
  slug: string;
}

export interface UpdateBoardParams {
  slug: string;
}

export const getBoards = async (): Promise<Board[]> => {
  if (isServerSide()) {
    // TODO:
    const response = await fetch(`/boards?test=${"something"}`);
    return response.json();
  }

  const response = await axiosClient.get<Board[]>("/boards");
  return response.data;
};

export const getBoard = async (getBoardDto: GetBoardParams): Promise<Board> => {
  const response = await axiosClient.get<
    Board,
    AxiosResponse<Board>,
    GetBoardParams
  >(`/boards/${getBoardDto.slug}`);

  return response.data;
};

export const createBoard = async (
  createBoardDto: CreateBoardParams
): Promise<Board> => {
  const response = await axiosClient.post<
    Board,
    AxiosResponse<Board>,
    CreateBoardParams
  >("/boards", createBoardDto);

  return response.data;
};

export const updateBoard = async (
  updateBoardDto: UpdateBoardParams
): Promise<Board> => {
  const response = await axiosClient.patch<
    Board,
    AxiosResponse<Board>,
    UpdateBoardParams
  >(`/boards/${updateBoardDto.slug}`, updateBoardDto);

  return response.data;
};
