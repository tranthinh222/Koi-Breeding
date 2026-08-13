import axios from "./axios-customize";

/**
 * 
Module Koi Dictionary
 */

import type { IKoiVarient, IModelPagination } from "../types/backend";

export const callCreateKoiVarient = (koiVarient: IKoiVarient) => {
	return axios.post<IKoiVarient>("/api/v1/dictionaries", { ...koiVarient });
};

export const callUpdateKoiVarient = (koiVarient: IKoiVarient) => {
	return axios.post<IKoiVarient>("/api/v1/dictionaries", { ...koiVarient });
};

export const callFetchKoiVarient = (query: string) => {
	return axios.get<IModelPagination<IKoiVarient>>(
		`/api/v1/dictionaries?${query}`,
	);
};

export const callFetchKoiVarientById = (id: number) => {
	return axios.get<IKoiVarient>(`/api/v1/dictionaries/${id}`);
};
