export interface LoginResponse {
  userId: number
  accessToken: string
  refreshToken: string
  expirationTime: string
  role: string
  panelUrl: string
}

export interface AuthUser {
  userId: number
  role: string
  panelUrl: string
}