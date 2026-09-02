import axios from "axios";
import { apiClient } from "./client";

export interface AuthRegisterResponse {
  username: String;
  email: String;
  birthday: String;
  gender: "MALE" | "FEMALE";
  location:
    | "HANOI"
    | "HO_CHI_MINH_CITY"
    | "DA_NANG"
    | "HAI_PHONG"
    | "CAN_THO"
    | "HUE"
    | "NHA_TRANG"
    | "DA_LAT"
    | "VUNG_TAU"
    | "BIEN_HOA"
    | "QUY_NHON"
    | "BUON_MA_THUOT";
  exp: Number;
  avatarUrl: String;
  password: String;
  confirmPassword: String;
}

export const uploadAvatar = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post("/upload/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.data.url;
};

export async function registerUser(
  data: AuthRegisterResponse,
): Promise<AuthRegisterResponse> {
  try {
    const response = await apiClient.post<AuthRegisterResponse>(
      "/auth/register",
      data,
    );
    return response.data as AuthRegisterResponse;
  } catch (error) {
    if (axios.isCancel(error)) throw error;
    console.error("Auth API request failed.", error);
    throw error;
  }
}

//Login
export interface LoginRequest {
  username?: string;
  email?: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  birthday: string | null;
  gender: "MALE" | "FEMALE" | null;
  role: "USER" | "ADMIN" | null;
  exp: number;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export const Login = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post("/auth/login", data);
    return response.data.data;
  } catch (error) {
    if (axios.isCancel(error)) throw error;
    console.error("Auth API request failed.", error);
    throw error;
  }
};

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    const response = await apiClient.get("/auth/me");
    return response.data.data ?? response.data;
  } catch (error: any) {
    if (error?.response?.status === 401) {
      console.log("User not authenticated");
      return null;
    }

    console.error("Get current user failed:", error);
    throw error;
  }
};

export const clearAuthStorage = (): void => {
  // Xóa sessionStorage
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("refreshToken");

  // Xóa localStorage
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("token");
  localStorage.removeItem("access");
};

export const logoutRequest = async (): Promise<void> => {
  try {
    await apiClient.post("/auth/logout");
    console.log("Logout successful");
  } catch (error) {
    console.error(
      "Logout request failed, but clearing local storage anyway:",
      error,
    );
  } finally {
    clearAuthStorage();
  }
};

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

export interface VerifyResetCodeRequest {
  email: string;
  code: string;
}

export interface VerifyResetCodeResponse {
  success: boolean;
  message: string;
  resetToken?: string;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export const forgotPassword = async (
  request: ForgotPasswordRequest,
): Promise<ForgotPasswordResponse> => {
  const response = await apiClient.post<ResetPasswordResponse>(
    "/auth/forgot-password",
    request,
  );

  return response.data;
};
export const resetPassword = async (
  request: ResetPasswordRequest,
): Promise<ResetPasswordResponse> => {
  const response = await apiClient.post<ResetPasswordResponse>(
    "/auth/reset-password",
    request,
  );

  return response.data;
};

export const verifyResetCode = async (
  request: VerifyResetCodeRequest,
): Promise<VerifyResetCodeResponse> => {
  const response = await apiClient.post<VerifyResetCodeResponse>(
    "/auth/verify-reset-code",
    request,
  );

  return response.data;
};
