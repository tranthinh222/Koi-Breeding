import type { IKoi, IRestResponse } from "../types/backend";
import { apiClient } from "./client";

export interface IRequestReleaseKoiDTO {
	pondId: number;
	inventoryId: number;
	quantity: number;
}

export interface IRequestMoveKoiDTO {
	targetKoiId: number;
	sourcePondId: number;
	targetPondId: number;
}

export interface IRequestFeedKoiDTO {
	userId: number;
	itemId: number;
	quantity: number;
}

export interface IResponseFeedKoiDTO {
	koi: IKoi;
	foodRestored: number;
	itemsUsed: number;
	remainingItemQuantity: number;
}

export const callReleaseKoiToPond = (
	requestReleaseKoiDTO: IRequestReleaseKoiDTO,
) => {
	return apiClient.post<IRestResponse<IKoi[]>>("/kois/import", {
		...requestReleaseKoiDTO,
	});
};

export const callFetchKoisInPond = (pondId: number) => {
	return apiClient.get<IRestResponse<IKoi[]>>(`/kois?pondId=${pondId}`);
};

export const callMoveKoi = (requestMoveKoiDTO: IRequestMoveKoiDTO) => {
	return apiClient.post<IRestResponse<IKoi>>("/kois/move", {
		...requestMoveKoiDTO,
	});
};

export const callFeedKoi = (
	koiId: number,
	requestFeedKoiDTO: IRequestFeedKoiDTO,
) => {
	return apiClient.post<IRestResponse<IResponseFeedKoiDTO>>(
		`/kois/${koiId}/feed`,
		requestFeedKoiDTO,
	);
};
