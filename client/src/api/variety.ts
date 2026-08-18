import type {
	IModelPagination,
	IRestResponse,
	IVariety,
} from "../types/backend";
import { apiClient } from "./client";

/**
 * 
Module Variety
 */

export const callCreateVariety = (variety: IVariety) => {
	return apiClient.post<IRestResponse<IVariety>>("/api/v1/varieties", {
		...variety,
	});
};

export const callUpdateVariety = (variety: IVariety) => {
	return apiClient.put<IRestResponse<IVariety>>("/api/v1/varieties", {
		...variety,
	});
};

export const callFetchAllVarieties = (query: string) => {
	return apiClient.get<IRestResponse<IModelPagination<IVariety>>>(
		`/api/v1/varieties?${query}`,
	);
};

export const callFetchVarietyById = (id: number) => {
	return apiClient.get<IRestResponse<IVariety>>(`/api/v1/varieties/${id}`);
};
