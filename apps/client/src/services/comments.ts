import { AxiosResponse } from "axios";

import axiosClient from "./axiosClient";

import { Comment } from "../schemas/comment";

import { PaginationOptions } from "../schemas/pagination-options";
import { PaginationResponse } from "../schemas/pagination-response";

export interface ListCommentsParams extends PaginationOptions {
  articleId: number | string;
}

export interface CreateCommentParams {
  articleId: number | string;
  content: string;
}

export interface UpdateCommentParams {
  content?: string;
}

export const getComment = async (id: number | string): Promise<Comment> => {
  const response = await axiosClient.get<Comment>(`/comments/${id}`);

  return response.data;
};

export const getComments = async (options: ListCommentsParams) => {
  const response = await axiosClient.get<
    PaginationResponse<Comment>,
    AxiosResponse<PaginationResponse<Comment>>
  >("/comments", { params: options });

  return response.data;
};

export const createComment = async (
  options: CreateCommentParams,
): Promise<Comment> => {
  const response = await axiosClient.post<
    Comment,
    AxiosResponse<Comment>,
    CreateCommentParams
  >("/comments", options);

  return response.data;
};

export const updateComment = async (
  id: number,
  options: UpdateCommentParams,
) => {
  const response = await axiosClient.patch<
    any,
    AxiosResponse<any>,
    UpdateCommentParams
  >(`/comments/${id}`, options);

  return response.data;
};
