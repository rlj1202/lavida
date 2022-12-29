import { AxiosResponse } from "axios";
import axiosClient from "./axiosClient";

// TODO:
interface Article {}

export interface CreateArticleParams {
  title: string;
  content: string;
}

export const getArticles = async (): Promise<Article[]> => {
  const response = await axiosClient.get<Article[]>("/articles");

  return response.data;
};

export const createArticle = async (
  createArticleParams: CreateArticleParams
): Promise<Article> => {
  const response = await axiosClient.post<
    Article,
    AxiosResponse<Article>,
    CreateArticleParams
  >("/articles", createArticleParams);

  return response.data;
};
