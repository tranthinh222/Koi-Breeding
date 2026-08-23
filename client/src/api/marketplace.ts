import axios from "axios";
import { apiClient } from "./client";

export type FishGender = "ALL" | "MALE" | "FEMALE";
export type MarketplaceCategory = "ALL" | "KOHAKU" | "SHOWA" | "OGON";

export interface MarketplaceItem {
  id: number;
  koiName: string;
  rarity: "Common" | "Premium" | "Legendary";
  image: string;
  price: number;
  currency: "Koins" | "VND";
  description: string;
  seller: string;

  breed: string;
  gender: FishGender;
  weight: number; // kg
  length: number; // cm
}

// API request params - tất cả optional, number để gửi lên backend
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
): Promise<MarketplaceItem[]> {
  try {
    const params: Record<string, string | number> = {};

    // Keyword
    if (filters.keyword?.trim()) {
      params.keyword = filters.keyword.trim();
    }

    // Category
    if (filters.category && filters.category !== "ALL") {
      params.category = filters.category;
    }

    // Gender
    if (filters.gender && filters.gender !== "ALL") {
      params.gender = filters.gender;
    }

    // Price range
    if (filters.minPrice !== undefined && filters.minPrice !== null) {
      params.minPrice = filters.minPrice;
    }
    if (filters.maxPrice !== undefined && filters.maxPrice !== null) {
      params.maxPrice = filters.maxPrice;
    }

    // Length range
    if (filters.minLength !== undefined && filters.minLength !== null) {
      params.minLength = filters.minLength;
    }
    if (filters.maxLength !== undefined && filters.maxLength !== null) {
      params.maxLength = filters.maxLength;
    }

    // Weight range
    if (filters.minWeight !== undefined && filters.minWeight !== null) {
      params.minWeight = filters.minWeight;
    }
    if (filters.maxWeight !== undefined && filters.maxWeight !== null) {
      params.maxWeight = filters.maxWeight;
    }

    const response = await apiClient.get("/marketplace", { params });
    return response.data.data as MarketplaceItem[];
  } catch (error) {
    if (axios.isCancel(error)) throw error;
    console.error("Marketplace filter API failed.", error);
    throw error;
  }
}
