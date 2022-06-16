import { TokenRaw } from "./token";

export interface LSAuthentication {
  username: string;
  token: TokenRaw;
  key: string;
  iv: string;
}

export interface Authentication {
  username: string;
  token: TokenRaw;
  key: CryptoKey;
  iv: ArrayBuffer;
}
