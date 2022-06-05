declare interface TokenProtected {
  SynchronizationBytes: ArrayBuffer;
  Header: Header;
  Payload: Payload;
  SignatureBytes: ArrayBuffer;
}

declare interface Header {
  alg: string;
  enc: string;
}

declare interface Payload {
  userId: number;
  sessionId: number;
}

declare interface TokenRaw {
  Synchronization: Synchronization;
  Header: Header;
  Payload: Payload;
  SignatureBytes: ArrayBuffer;
}

declare interface Synchronization {
  syn: number;
  inc: number;
}
