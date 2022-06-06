import {
  decryptAesCbc,
  encryptAesCbc,
  arrayBufferToBase64,
  base64ToArrayBuffer,
  utf8ToBase64,
  base64ToUtf8,
  arrayBufferToUtf8,
} from "@/tetatet/cryptoutil";
import { TokenProtected, TokenRaw } from "@/tetatet/model/token";

export default class TokenService {
  private current: string;
  private key: CryptoKey;
  private iv: ArrayBuffer;

  constructor(token: string, key: CryptoKey, iv: ArrayBuffer) {
    this.current = token;
    this.key = key;
    this.iv = iv;
  }

  public getCurrent(): string {
    return this.current;
  }

  public setCurrent(token: string) {
    this.current = token;
  }

  public async next(token: string): Promise<string> {
    const prot = unpack(token);
    const raw = await unprotect(prot, this.key, this.iv);

    raw.Synchronization.syn += raw.Synchronization.inc;

    const reprot = await protect(raw, this.key, this.iv);
    const repacked = pack(reprot);

    return repacked;
  }

  public async validateNext(next: string): Promise<boolean> {
    const prevRaw = await unprotect(unpack(this.current), this.key, this.iv);
    const nextRaw = await unprotect(unpack(next), this.key, this.iv);

    return (
      prevRaw.Synchronization.syn + prevRaw.Synchronization.inc ==
      nextRaw.Synchronization.syn
    );
  }
}

function pack(prot: TokenProtected): string {
  const b64Syn = arrayBufferToBase64(prot.SynchronizationBytes);
  const b64Head = utf8ToBase64(JSON.stringify(prot.Header));
  const b64Pld = utf8ToBase64(JSON.stringify(prot.Payload));
  const b64Sign = arrayBufferToBase64(prot.SignatureBytes);

  return [b64Syn, b64Head, b64Pld, b64Sign].join(".");
}

function unpack(token: string): TokenProtected {
  const tokenParts = token.split(".");
  if (tokenParts.length != 4) {
    throw "token is damaged or of wrong format";
  }

  const syn = base64ToArrayBuffer(tokenParts[0]);
  const head = JSON.parse(base64ToUtf8(tokenParts[1]));
  const plb = JSON.parse(base64ToUtf8(tokenParts[2]));
  const sign = base64ToArrayBuffer(tokenParts[3]);

  return {
    SynchronizationBytes: syn,
    Header: head,
    Payload: plb,
    SignatureBytes: sign,
  };
}

async function protect(
  raw: TokenRaw,
  key: CryptoKey,
  iv: ArrayBuffer
): Promise<TokenProtected> {
  const synb = utf8ToBase64(JSON.stringify(raw.Synchronization));
  const encsyn = await encryptAesCbc(base64ToArrayBuffer(synb), key, iv);

  return {
    SynchronizationBytes: encsyn,
    Header: raw.Header,
    Payload: raw.Payload,
    SignatureBytes: raw.SignatureBytes,
  };
}

async function unprotect(
  prot: TokenProtected,
  key: CryptoKey,
  iv: ArrayBuffer
): Promise<TokenRaw> {
  const synb = await decryptAesCbc(prot.SynchronizationBytes, key, iv);

  return {
    Synchronization: JSON.parse(arrayBufferToUtf8(synb)),
    Header: prot.Header,
    Payload: prot.Payload,
    SignatureBytes: prot.SignatureBytes,
  };
}
