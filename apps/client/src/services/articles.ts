import { AxiosResponse } from 'axios';

import axiosClient from './axiosClient';

import { Article } from '../schemas/article';

import { PaginationResponse } from '../schemas/pagination-response';
import { PaginationOptions } from '../schemas/pagination-options';

export interface ListArticlesParams extends PaginationOptions {
  boardName?: string;
}

export interface CreateArticleParams {
  title: string;
  content: string;
  boardName: string;
}

export interface UpdateArticleParams {
  title?: string;
  content?: string;
}

export const getArticles = async (
  options: ListArticlesParams,
): Promise<PaginationResponse<Article>> => {
  const response = await axiosClient.get<
    PaginationResponse<Article>,
    AxiosResponse<PaginationResponse<Article>>
  >('/articles', { params: options });

  return response.data;
};

export const getArticle = async (id: number | string): Promise<Article> => {
  const response = await axiosClient.get<Article>(`/articles/${id}`);

  return response.data;
};

export const createArticle = async (
  createArticleParams: CreateArticleParams,
): Promise<Article> => {
  const response = await axiosClient.post<
    Article,
    AxiosResponse<Article>,
    CreateArticleParams
  >('/articles', createArticleParams);

  return response.data;
};

export const updateArticle = async (
  id: number,
  options: UpdateArticleParams,
) => {
  const response = await axiosClient.patch<
    any,
    AxiosResponse<any>,
    UpdateArticleParams
  >(`/articles/${id}`, options);

  return response.data;
};

export const deleteArticle = async (id: number) => {
  const response = await axiosClient.delete(`/articles/${id}`);

  return response.data;
};
