import type { IKoiVarient, IModelPagination, IVariety } from "../types/backend";
import axios from "./axios-customize";

/**
 * 
Module Koi Dictionary
 */

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

/**
 * 
Module Variety
 */

export const callCreateVariety = (variety: IVariety) => {
	return axios.post<IVariety>("/api/v1/varieties", { ...variety });
};

export const callUpdateVariety = (variety: IVariety) => {
	return axios.put<IVariety>("/api/v1/varieties", { ...variety });
};

export const callFetchAllVarieties = (query: string) => {
	return axios.get<IModelPagination<IVariety>>(`/api/v1/varieties?${query}`);
};

export const callFetchVarietyById = (id: number) => {
	return axios.get<IVariety>(`/api/v1/varieties/${id}`);
};
