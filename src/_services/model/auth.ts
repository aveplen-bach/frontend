import { TokenRaw } from "./token";

export interface LSAuthentication {
  username: string;
  raw: TokenRaw;
  key: string;
  iv: string;
}

export interface Authentication {
  username: string;
  raw: TokenRaw;
  key: CryptoKey;
  iv: ArrayBuffer;
}
