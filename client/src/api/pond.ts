/**
 * 
Module Pond
 */

import type { IModelPagination, IPond, IRestResponse } from "../types/backend";
import { apiClient } from "./client";

export interface IRequestBuyPondDTO {
	name: string;
	description: string;
	price: number;
	ownerId: number;
}

export const callBuyPond = (requestBuyPondDTO: IRequestBuyPondDTO) => {
	return apiClient.post<IRestResponse<IPond>>("/api/v1/ponds", {
		...requestBuyPondDTO,
	});
};

export const callFetchAllPonds = (query: string) => {
	return apiClient.get<IRestResponse<IModelPagination<IPond>>>(
		`/api/v1/ponds?${query}`,
	);
};

export const callUpdatePond = (pond: IPond) => {
	return apiClient.put<IRestResponse<IPond>>("/api/v1/ponds", { ...pond });
};
