/**
 * 
Module Pond
 */

import type { IModelPagination, IPond, IRestResponse } from "../types/backend";
import { apiClient } from "./client";

export interface Pond {
	id: number;
	name: string;
	capacity: number;
	currentKoi: number;
}

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

export async function getPondsByOwner(userId: number): Promise<Pond[]> {
	const response = await apiClient.get<IRestResponse<Pond[]>>("/ponds/owner", {
		params: { userId },
	});
	return response.data.data ?? [];
}
