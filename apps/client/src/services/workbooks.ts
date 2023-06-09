import { PaginationResponse } from '../schemas/pagination-response';
import { Workbook } from '../schemas/workbook';
import axiosClient from './axiosClient';

export const getWorkbooks = async (): Promise<PaginationResponse<Workbook>> => {
  const response = await axiosClient.get<PaginationResponse<Workbook>>(
    '/workbooks',
  );

  return response.data;
};

export const getWorkbook = async (id: number | string): Promise<Workbook> => {
  const response = await axiosClient.get<Workbook>(`/workbooks/${id}`);

  return response.data;
};
