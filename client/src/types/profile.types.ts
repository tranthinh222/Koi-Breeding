export type Gender = "MALE" | "FEMALE" | "";

export type UserProfile = {
  id: number;
  username: string;
  email: string;
  birthday: string | null;
  gender: Gender | null;
  role?: "USER" | "ADMIN" | null;
  exp: number;
  avatarUrl: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type ProfileForm = {
  email: string;
  birthday: string;
  gender: Gender;
};

export const ACCEPTED_AVATAR_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/svg+xml",
];