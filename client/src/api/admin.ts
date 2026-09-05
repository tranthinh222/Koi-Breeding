import { apiClient } from "./client";

export type AdminUserStatus = "ACTIVE" | "BANNED" | "DELETED";

export interface AdminUserDto {
  id: number;
  username: string;
  email: string;
  birthday: string | null;
  gender: "MALE" | "FEMALE" | null;
  role: "USER" | "ADMIN";
  status: AdminUserStatus | null;
  isBanned: boolean | null;
  exp: number;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
}

export interface AdminUsersResponse {
  meta: PaginationMeta;
  result: AdminUserDto[];
}

export interface AdminMetricDto {
  total: number;
  currentMonth: number;
  previousMonth: number;
  delta: number;
  growthPercent: number | null;
}

export interface AdminRankingUserDto {
  id: number;
  username: string;
  avatarUrl: string | null;
  exp: number;
  level: number;
}

export interface AdminTopTransactionDto {
  source: "SHOP" | "MARKETPLACE";
  id: number;
  title: string;
  amount: number;
  description: string | null;
  createdAt: string;
}

export interface AdminDashboardResponse {
  users: AdminMetricDto;
  shopPurchases: AdminMetricDto;
  marketplaceTrades: AdminMetricDto;
  topUsers: AdminRankingUserDto[];
  highestLevelUser: AdminRankingUserDto | null;
  topTransactions: AdminTopTransactionDto[];
}

export interface AdminModerationUserRequest {
  id: number;
  status?: AdminUserStatus | null;
  password?: string | null;
  reason?: string | null;
}

export async function getAdminUsers(
  page = 1,
  pageSize = 8,
): Promise<AdminUsersResponse> {
  const response = await apiClient.get("/admin/users", {
    params: {
      page: Math.max(page - 1, 0),
      size: pageSize,
    },
  });

  return response.data.data as AdminUsersResponse;
}

export async function getAdminDashboard(
  userLimit = 3,
  transactionLimit = 3,
): Promise<AdminDashboardResponse> {
  const response = await apiClient.get("/admin/dashboard", {
    params: {
      userLimit,
      transactionLimit,
    },
  });

  return response.data.data as AdminDashboardResponse;
}

export async function updateStatusUser(
  request: AdminModerationUserRequest,
): Promise<AdminUserDto> {
  const response = await apiClient.put("/admin/users", request);
  return response.data.data as AdminUserDto;
}

export interface AdminItem {
  id: number;
  imageUrl?: string;
  nameItem: string;
  description?: string;
  itemType: string;
  price: number;
  effectType: string;
}
// Interface định nghĩa cấu trúc Page trả về từ Spring Boot
export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number; // trang hiện tại
}

export interface ItemFilterParams {
  page?: number;
  size?: number;
  search?: string;
  itemType?: string;
  effectType?: string;
  sortPrice?: string;
}

export async function getAdminItems({
  page = 0,
  size = 8,
  search = "",
  itemType = "ALL",
  effectType = "ALL",
  sortPrice = "DEFAULT",
}: ItemFilterParams): Promise<PageResponse<AdminItem>> {
  const params: Record<string, any> = { page, size };

  if (search.trim()) params.search = search.trim();
  if (itemType !== "ALL") params.itemType = itemType;
  if (effectType !== "ALL") params.effectType = effectType;
  if (sortPrice !== "DEFAULT") params.sortPrice = sortPrice.toLowerCase(); // 'asc' hoặc 'desc'

  const response = await apiClient.get("/admin/items", { params });

  return response.data.data as PageResponse<AdminItem>;
}

export interface AddAdminItemRequest {
  imageUrl: string;
  nameItem: string;
  description: string;
  itemType: string;
  price: number;
  effectType: string;
}

export async function addAdminItem(
  request: AddAdminItemRequest,
): Promise<AdminItem> {
  const response = await apiClient.post("/admin/items/addition", request);
  return response.data.data as AdminItem;
}

export const updateAdminItem = async (
  id: number,
  data: Omit<AdminItem, "id">,
) => {
  const response = await apiClient.patch(`/admin/items/${id}`, data);

  return response.data.data;
};

export const deleteAdminItem = async (id: number) => {
  const response = await apiClient.delete(`/admin/items/${id}`);

  return response.data.data;
};
