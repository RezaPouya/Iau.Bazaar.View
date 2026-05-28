// app/types/auth.ts
export interface LoginResponse {
  userId: number;
  accessToken: string;
  refreshToken: string;
  expirationTime: string;
  role: string;
  panelUrl: string;
  fullName?: string; // if your API returns it
}

export interface AuthUser {
  userId: number;
  role: string;
  panelUrl: string;
  fullName?: string; // optional
  FirstName: string;
  LastName: string;
}
