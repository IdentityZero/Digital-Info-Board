import { jwtDecode } from "jwt-decode";

import { DecodedJWTType } from "../types/UserTypes";

export const isJwtExpired = (token: string) => {
  try {
    const { exp } = jwtDecode<DecodedJWTType>(token);
    const now = Date.now() / 1000;
    return exp < now;
  } catch (err) {
    return true;
  }
};
