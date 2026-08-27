import axios from "axios";
import { apiClient } from "./client";
import type { IModelPagination, IPond, IRestResponse } from "../types/backend";

export interface Pond {
  id: number;
  name: string;
  capacity: number;
  currentKoi: number;
}

export async function getPondsByOwner(userId: number): Promise<Pond[]> {
  try {
    const response = await apiClient.get(`/ponds/owner`, {
      params: {
        userId,
      },
    });

    return response.data.data;
  } catch (error) {
    if (axios.isCancel(error)) throw error;
    console.error("API request failed.", error);
    throw error;
  }
}

export async function getPonds(
  page = 0,
  size = 20,
): Promise<IModelPagination<IPond>> {
  try {
    const response = await apiClient.get<IRestResponse<IModelPagination<IPond>>>("/ponds", {
      params: {
        page,
        size,
      },
    });

    return (
      response.data.data ?? {
        meta: {
          page: page + 1,
          pageSize: size,
          totalPages: 0,
          totalElements: 0,
        },
        result: [],
      }
    );
  } catch (error) {
    if (axios.isCancel(error)) throw error;
    console.error("API request failed.", error);
    throw error;
  }
}
