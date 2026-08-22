import axios from "axios";
import { apiClient } from "./client";
import type { ShopFilters } from "../components/marketplace/MarketplaceTabs";

export type FishGender = "ALL" | "MALE" | "FEMALE";

export type MarketplaceCategory = "ALL" | "KOHAKU" | "SHOWA" | "OGON";

export type FishSize = "ALL" | "SMALL" | "MEDIUM" | "LARGE";

export type FishWeight = "ALL" | "SMALL" | "MEDIUM" | "LARGE";

export type FilterGender = "ALL" | "MALE" | "FEMALE";

export interface MarketplaceItem {
  id: number;
  koiName: string;

  rarity: "Common" | "Premium" | "Legendary";

  image: string;

  price: number;
  currency: "Koins" | "VND";

  description: string;

  seller: string;

  // --- Thông số cá mới thêm ---
  breed: string; // Tên giống, VD: "Kohaku", "Showa Sanshoku"
  gender: FishGender; // Giới tính
  weight: number; // Cân nặng (kg)
  length: number; // Chiều dài (cm)
}

export interface MarketplaceFilters {
  category?: MarketplaceCategory;
  keyword?: string;
  minPrice?: number;
  maxPrice?: number;
  size?: FishSize;
  weight?: FishWeight;
  gender?: FishGender;
}

// export const mockMarketplaceItems: MarketplaceItem[] = [
//   {
//     id: 1,
//     name: "Crimson Emperor",
//     rarity: "Legendary",
//     image:
//       "https://res.cloudinary.com/djmcluh5n/image/upload/v1786629266/uploads/items/cxnccf0exmmyaf0ddf5e.svg",
//     price: 5000,
//     currency: "Koins",
//     description: "A legendary Kohaku koi with a beautiful crimson pattern.",
//     seller: "Master Zen",
//     breed: "Kohaku",
//     gender: "MALE",
//     weight: 3.5,
//     length: 45,
//   },
//   {
//     id: 2,
//     name: "Midnight Bloom",
//     rarity: "Premium",
//     image:
//       "https://res.cloudinary.com/djmcluh5n/image/upload/v1786629292/uploads/items/jzckhsxukfrdilmrsjrq.svg",
//     price: 2100,
//     currency: "Koins",
//     description: "A premium Showa koi with a striking dark pattern.",
//     seller: "Koi Master",
//     breed: "Showa Sanshoku",
//     gender: "FEMALE",
//     weight: 2.8,
//     length: 38,
//   },
//   {
//     id: 3,
//     name: "Sunny Glint",
//     rarity: "Common",
//     image:
//       "https://res.cloudinary.com/djmcluh5n/image/upload/v1786629315/uploads/items/gi7oeh6f4h5fphewfano.svg",
//     price: 450,
//     currency: "Koins",
//     description: "A common Ogon koi with a bright golden appearance.",
//     seller: "Koi Farmer",
//     breed: "Ogon",
//     gender: "MALE",
//     weight: 1.2,
//     length: 25,
//   },
// ];

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
  filters: MarketplaceFilters,
): Promise<MarketplaceItem[]> {
  try {
    const params: Record<string, string | number> = {};

    if (filters.keyword?.trim()) {
      params.keyword = filters.keyword.trim();
    }

    if (filters.category && filters.category !== "ALL") {
      params.category = filters.category;
    }

    if (filters.size && filters.size !== "ALL") {
      params.size = filters.size;
    }

    if (filters.weight && filters.weight !== "ALL") {
      params.weight = filters.weight;
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

    const response = await apiClient.get("/marketplace", {
      params,
    });

    return response.data.data as MarketplaceItem[];
  } catch (error) {
    if (axios.isCancel(error)) throw error;

    console.error("Marketplace filter API failed.", error);
    throw error;
  }
}
