import type { IKoi, IRestResponse } from "../types/backend";
import { apiClient } from "./client";

export interface IRequestReleaseKoiDTO {
	pondId: number;
	inventoryId: number;
	quantity: number;
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
