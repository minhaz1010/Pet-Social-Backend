import { TRole } from "../module/user/user.interface";

export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: TRole;
    };
  }
}
