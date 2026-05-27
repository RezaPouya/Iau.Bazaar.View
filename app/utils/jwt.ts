import { jwtDecode } from 'jwt-decode';

export interface JwtPayload {
  exp: number;
}

export const getTokenExpiration = (
  token: string
) => {

  try {

    const decoded =
      jwtDecode<JwtPayload>(token);

    return decoded.exp * 1000;

  } catch {

    return 0;
  }
};