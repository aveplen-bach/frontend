import { TokenRaw } from "./token";

export interface Authentication {
  username: string;
  raw: TokenRaw;
  key: string;
  iv: string;
}
