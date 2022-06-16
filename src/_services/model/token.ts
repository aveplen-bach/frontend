export interface TokenProtected {
  SynBytes: ArrayBuffer;
  Header: Header;
  Pld: Payload;
  Sign: string;
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
  Syn: Synchronization;
  Header: Header;
  Pld: Payload;
  Sign: string;
}

export interface Synchronization {
  syn: number;
  inc: number;
}
