declare interface LoginRequest {
  username: string;
  password: string;
  photo: Blob;
}

declare interface LoginResult {
  token: string;
  key: CryptoKey;
  iv: ArrayBuffer;
}
