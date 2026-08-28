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
	return apiClient.post<IRestResponse<IKoiVarient>>("/dictionaries", {
		...koiVarient,
	});
};

export const callUpdateKoiVarient = (koiVarient: IKoiVarient) => {
	return apiClient.post<IRestResponse<IKoiVarient>>("/dictionaries", {
		...koiVarient,
	});
};

export const callFetchKoiVarient = (query: string) => {
	return apiClient.get<IRestResponse<IModelPagination<IKoiVarient>>>(
		`/dictionaries?${query}`,
	);
};

export const callFetchKoiVarientById = (id: number) => {
	return apiClient.get<IRestResponse<IKoiVarient>>(`/dictionaries/${id}`);
};

export const callUploadKoiVarientImage = (file: File) => {
	const formData = new FormData();
	formData.append("file", file);
	return apiClient.post<IRestResponse<{ url: string }>>(
		`/upload/dictionary`,
		formData,
		{
			headers: {
				"Content-Type": "multipart/form-data",
			},
		},
	);
};
