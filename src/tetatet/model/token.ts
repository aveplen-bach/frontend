export interface TokenProtected {
  SynchronizationBytes: ArrayBuffer;
  Header: Header;
  Payload: Payload;
  SignatureBytes: ArrayBuffer;
}

export interface Header {
  alg: string;
  enc: string;
}

export interface Payload {
  userId: number;
  admin: boolean;
}

export interface TokenRaw {
  Synchronization: Synchronization;
  Header: Header;
  Payload: Payload;
  SignatureBytes: ArrayBuffer;
}

export interface Synchronization {
  syn: number;
  inc: number;
}
