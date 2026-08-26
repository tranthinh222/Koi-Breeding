import axios from "axios";
import { apiClient } from "./client";

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
