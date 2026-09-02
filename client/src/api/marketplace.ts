import axios from "axios";
import { apiClient } from "./client";

export type FishGender = "ALL" | "MALE" | "FEMALE";
export type MarketplaceCategory = "ALL" | "KOHAKU" | "SHOWA" | "OGON";

export interface MarketplaceItem {
  id: number;
  koiId: number;
  koiName: string;
  rarity: "Common" | "Premium" | "Legendary";
  image: string;
  price: number;
  description: string;
  sellerId: number;
  seller: string;
  breed: string;
  gender: FishGender;
  weight: number;
  length: number;
}

export interface MarketplaceApiParams {
  category?: MarketplaceCategory;
  keyword?: string;
  minPrice?: number;
  maxPrice?: number;
  minLength?: number;
  maxLength?: number;
  minWeight?: number;
  maxWeight?: number;
  gender?: FishGender;
}

export interface MarketplacePage {
  content: MarketplaceItem[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export async function MarketplaceItems(): Promise<MarketplaceItem[]> {
  try {
    const response = await apiClient.get("/marketplace");
    return response.data.data as MarketplaceItem[];
  } catch (error) {
    if (axios.isCancel(error)) throw error;
    console.error("Marketplace API request failed.", error);
    throw error;
  }
}

export async function getMarketplaceItems(
  filters: MarketplaceApiParams,
  page: number = 0,
  size: number = 12,
): Promise<MarketplacePage> {
  try {
    const params: Record<string, string | number> = {
      page,
      size,
    };

    if (filters.keyword?.trim()) {
      params.keyword = filters.keyword.trim();
    }

    if (filters.category && filters.category !== "ALL") {
      params.category = filters.category;
    }

    if (filters.gender && filters.gender !== "ALL") {
      params.gender = filters.gender;
    }

    if (filters.minPrice !== undefined) {
      params.minPrice = filters.minPrice;
    }

    if (filters.maxPrice !== undefined) {
      params.maxPrice = filters.maxPrice;
    }

    if (filters.minLength !== undefined) {
      params.minLength = filters.minLength;
    }

    if (filters.maxLength !== undefined) {
      params.maxLength = filters.maxLength;
    }

    if (filters.minWeight !== undefined) {
      params.minWeight = filters.minWeight;
    }

    if (filters.maxWeight !== undefined) {
      params.maxWeight = filters.maxWeight;
    }

    const response = await apiClient.get("/marketplace", {
      params,
    });

    return response.data.data as MarketplacePage;
  } catch (error) {
    if (axios.isCancel(error)) throw error;

    console.error("Marketplace filter API failed.", error);
    throw error;
  }
}

export interface MarketplaceKoi {
  koiId: number;
  pondId: number;
  koiName: string;
  breed: string;
  gender: FishGender;
  weight: number; // kg
  length: number; // cm
  rarity: "Common" | "Premium" | "Legendary";
  imageUrl: string;
  price: number;
}

export async function getMarketListKois(
  userId: number,
): Promise<MarketplaceKoi[]> {
  try {
    const response = await apiClient.get(`/marketplace/listKoi`, {
      params: { userId },
    });
    return response.data.data as MarketplaceKoi[];
  } catch (error) {
    if (axios.isCancel(error)) throw error;
    console.error("Marketplace kois API request failed.", error);
    throw error;
  }
}

export async function getMarketBuyKois(
  userId: number,
): Promise<MarketplaceKoi[]> {
  try {
    const response = await apiClient.get(`/marketplace/koiPurchase`, {
      params: { userId },
    });
    return response.data.data as MarketplaceKoi[];
  } catch (error) {
    if (axios.isCancel(error)) throw error;
    console.error("Marketplace kois API request failed.", error);
    throw error;
  }
}

export interface SellKoiRequest {
  koiId: number;
  price: number;
}

export async function sellKoi(
  koiId: number,
  price: number,
  userId: number,
): Promise<MarketplaceKoi> {
  try {
    const response = await apiClient.post(
      "/marketplace/saleKoi",
      {
        koiId,
        price,
      },
      {
        params: {
          userId,
        },
      },
    );

    return response.data.data as MarketplaceKoi;
  } catch (error) {
    if (axios.isCancel(error)) throw error;

    console.error("Sell koi API request failed.", error);
    throw error;
  }
}

export async function deleteKoiFromMarket(
  koiId: number,
  userId: number,
): Promise<void> {
  try {
    await apiClient.delete("/marketplace/deletionKoi", {
      data: {
        koiId,
        userId,
      },
    });
  } catch (error) {
    if (axios.isCancel(error)) throw error;

    console.error("Delete koi API request failed.", error);
    throw error;
  }
}

export interface BuyKoiRequest {
  userId: number;
  sellerId: number;
  koiId: number;
  price: number;
  pondId: number;
}

export async function buyKoi(
  userId: number,
  sellerId: number,
  koiId: number,
  price: number,
  pondId: number,
): Promise<MarketplaceKoi> {
  try {
    const response = await apiClient.post(
      "/marketplace/purchase",
      {
        sellerId,
        koiId,
        price,
        pondId,
      },
      {
        params: {
          userId,
        },
      },
    );

    return response.data.data as MarketplaceKoi;
  } catch (error) {
    if (axios.isCancel(error)) throw error;

    console.error("Buy koi API request failed.", error);
    throw error;
  }
}
