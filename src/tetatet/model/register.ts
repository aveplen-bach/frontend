export interface RegisterRequest {
  username: string;
  password: string;
  repeat: string;
  admin: boolean;
  photo: ArrayBuffer;
}
