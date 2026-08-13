import axios from "axios";
import { apiClient } from "./client";

export type InventoryCategory = "FOOD" | "MEDICINE" | "KOI";
export interface ItemInventory {
  id: number;
  name: string;
  itemType: InventoryCategory;
  effectValue: number;
  price: number;
  description: string;
  quantity: number;
  image?: string;
}

export const mockInventory: ItemInventory[] = [
  {
    id: 1,
    name: "Koi - Kohaku",
    itemType: "KOI",
    effectValue: 10,
    price: 100,
    description: "Classic white Koi with vivid red Hi markings.",
    quantity: 1,
  },
  {
    id: 2,
    name: "Koi - Showa Sanshoku",
    itemType: "KOI",
    effectValue: 15,
    price: 150,
    description: "A striking Koi with a black body and red and white markings.",
    quantity: 2,
  },
  {
    id: 3,
    name: "Koi - Asagi",
    itemType: "KOI",
    effectValue: 12,
    price: 120,
    description: "A beautiful Koi with a blue-grey body and red markings.",
    quantity: 1,
  },
  {
    id: 4,
    name: "Koi - Ogon",
    itemType: "KOI",
    effectValue: 8,
    price: 80,
    description: "A metallic Koi with a solid gold or platinum color.",
    quantity: 3,
  },

  {
    id: 5,
    name: "Koi Food - Aqua Master",
    itemType: "FOOD",
    effectValue: 15,
    price: 15,
    description: "Recover 15 food points for your Koi.",
    quantity: 10,
  },
  {
    id: 6,
    name: "Koi Food - Bethech",
    itemType: "FOOD",
    effectValue: 25,
    price: 25,
    description: "A balanced food for healthy Koi growth.",
    quantity: 5,
  },

  {
    id: 7,
    name: "Health Elixir - KAFKA",
    itemType: "MEDICINE",
    effectValue: 30,
    price: 45,
    description: "Restores Koi health with a premium formula.",
    quantity: 3,
  },
  {
    id: 8,
    name: "Environment Elixir - KMnO4",
    itemType: "MEDICINE",
    effectValue: 20,
    price: 15,
    description: "Recovers pond water quality.",
    quantity: 4,
  },
];

export async function getInventory(userId: number): Promise<ItemInventory[]> {
  try {
    const response = await apiClient.get(`/inventory`);
    console.log("Inventory API:", response.data);
    return response.data.data as ItemInventory[];
  } catch (error) {
    if (axios.isCancel(error)) throw error;
    console.error(
      "Shop API request failed. Using demo products instead.",
      error,
    );
    // throw error;
    return mockInventory;
  }
}

export async function addItemToInventory(
  userId: number,
  itemId: number,
  quantity: number,
): Promise<ItemInventory> {
  try {
    const response = await apiClient.post(
      `/inventory/items/${itemId}/addition`,
      {
        quantity: quantity,
      },
    );
    return response.data.data as ItemInventory;
  } catch (error) {
    if (axios.isCancel(error)) throw error;
    console.error(
      "Shop API request failed. Using demo products instead.",
      error,
    );
    // throw error;
    const item = mockInventory.find((item) => item.id === itemId);

    if (!item) {
      throw new Error("Item không tồn tại");
    }

    const updatedItem: ItemInventory = {
      ...item,
      quantity: Math.max(0, item.quantity + quantity),
    };

    return updatedItem;
  }
}

export async function useItemFromInventory(
  userId: number,
  itemId: number,
  quantity: number,
): Promise<ItemInventory> {
  try {
    const response = await apiClient.post(`/inventory/items/${itemId}/usages`, {
      quantity: quantity,
    });
    return response.data.data as ItemInventory;
  } catch (error) {
    if (axios.isCancel(error)) throw error;
    console.error(
      "Shop API request failed. Using demo products instead.",
      error,
    );
    // throw error;
    const item = mockInventory.find((item) => item.id === itemId);

    if (!item) {
      throw new Error("Item không tồn tại");
    }

    const updatedItem: ItemInventory = {
      ...item,
      quantity: Math.max(0, item.quantity - quantity),
    };

    return updatedItem;
  }
}
