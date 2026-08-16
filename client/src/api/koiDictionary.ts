/**
 * 
Module Koi Dictionary
 */

import type {
	IKoiVarient,
	IModelPagination,
	IRestResponse,
} from "../types/backend";
import { apiClient } from "./client";

export const callCreateKoiVarient = (koiVarient: IKoiVarient) => {
	return apiClient.post<IRestResponse<IKoiVarient>>("/api/v1/dictionaries", {
		...koiVarient,
	});
};

export const callUpdateKoiVarient = (koiVarient: IKoiVarient) => {
	return apiClient.post<IRestResponse<IKoiVarient>>("/api/v1/dictionaries", {
		...koiVarient,
	});
};

export const callFetchKoiVarient = (query: string) => {
	return apiClient.get<IRestResponse<IModelPagination<IKoiVarient>>>(
		`/api/v1/dictionaries?${query}`,
	);
};

export const callFetchKoiVarientById = (id: number) => {
	return apiClient.get<IRestResponse<IKoiVarient>>(
		`/api/v1/dictionaries/${id}`,
	);
};
