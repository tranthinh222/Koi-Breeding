import { apiClient } from "./client";
import type { IModelPagination, IRestResponse } from "../types/backend";

export interface Transaction {
  id: number;
  itemId: number;
  itemName: string;
  amount: number;
  transactionType: "DEPOSIT" | "BUY_FOOD" | "BUY_FISH" | "SELL_FISH";
  status: "PENDING" | "CANCELLED" | "SUCCESSED" | "FAILED";
  description: string;
  createdAt: string;
}

export async function getTransactions(
  userId: number,
  page: number,
  pageSize: number,
  sortDirection: "asc" | "desc",
  filter: "ALL" | "BOUGHT" | "SOLD",
): Promise<IModelPagination<Transaction>> {
  const response = await apiClient.get(`/users/${userId}/transactions`, {
    params: {
      page: page - 1,
      size: pageSize,
      sort: `createdAt,${sortDirection}`,
      filter,
    },
  });

  console.log("TRANSACTION API RESPONSE:", response.data);

  return response.data.data;
}
