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

export interface IResponseBuyPondDTO {
	pond: IPond;
	balance: number;
}

export interface IResponseUpgradePondDTO {
	pond: IPond;
	balance: number;
}

export const callBuyPond = (requestBuyPondDTO: IRequestBuyPondDTO) => {
	return apiClient.post<IRestResponse<IResponseBuyPondDTO>>("/ponds", {
		...requestBuyPondDTO,
	});
};

export const callFetchAllPonds = (query: string) => {
	return apiClient.get<IRestResponse<IModelPagination<IPond>>>(
		`/ponds?${query}`,
	);
};

export const callUpdatePond = (pond: IPond) => {
	return apiClient.put<IRestResponse<IPond>>("/ponds", { ...pond });
};

export const callUpgradePond = (pondId: number) => {
	return apiClient.put<IRestResponse<IResponseUpgradePondDTO>>(
		`/ponds/upgrade?pondId=${pondId}`,
	);
};
