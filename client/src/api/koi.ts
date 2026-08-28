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
	return apiClient.post<IRestResponse<IKoi[]>>("/api/v1/kois/import", {
		...requestReleaseKoiDTO,
	});
};

export const callFetchKoisInPond = (pondId: number) => {
	return apiClient.get<IRestResponse<IKoi[]>>(
		`/api/v1/kois?pondId=${pondId}`,
	);
};
