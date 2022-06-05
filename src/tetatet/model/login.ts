export interface LoginRequest {
  username: string;
  password: string;
  photo: Blob;
}

export interface LoginResult {
  token: string;
  key: CryptoKey;
  iv: ArrayBuffer;
}
