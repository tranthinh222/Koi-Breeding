import type {
	BreedingRecipeType,
	BreedingStatus,
	BreedingType,
	IBreedingEvent,
	IBreedingRecipe,
	IModelPagination,
	IRestResponse,
} from "../types/backend";
import { apiClient } from "./client";

export interface ICreateBreedingEventRequest {
	fatherId: number;
	motherId: number;
	pondId: number;
	breedingType: BreedingType;
	userId: number;
}

export interface IBreedingHistoryQuery {
	userId: number;
	page: number;
	size: number;
	search?: string;
	type?: BreedingType;
	status?: BreedingStatus;
	pondId?: number;
	ended?: boolean;
	sort?: string;
}

export const callCreateBreedingEvent = (request: ICreateBreedingEventRequest) =>
	apiClient.post<IRestResponse<IBreedingEvent>>("/breeding-events", request);

export const callFetchBreedingHistory = (query: IBreedingHistoryQuery) =>
	apiClient.get<IRestResponse<IModelPagination<IBreedingEvent>>>(
		"/breeding-events",
		{ params: query },
	);

export const callFetchBreedingRates = (query: {
	page: number;
	size: number;
	search?: string;
	type?: BreedingRecipeType;
	varietyId?: number;
	shape?: string;
	scaleType?: string;
}) => apiClient.get<IRestResponse<IModelPagination<IBreedingRecipe>>>("/breeding-rates", { params: query });

export const callFetchPairRates = (fatherId: number, motherId: number) =>
	apiClient.get<IRestResponse<IBreedingRecipe[]>>("/breeding-rates/pair", {
		params: { fatherId, motherId },
	});

export const callAdvanceBreedingEvent = (eventId: number, userId: number) =>
	apiClient.post<IRestResponse<IBreedingEvent>>(`/breeding-events/${eventId}/advance`, undefined, { params: { userId } });

export const callCancelBreedingEvent = (eventId: number, userId: number) =>
	apiClient.post<IRestResponse<IBreedingEvent>>(`/breeding-events/${eventId}/cancel`, undefined, { params: { userId } });
