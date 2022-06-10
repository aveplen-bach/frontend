import { TokenProtected, TokenRaw } from "@/_services/model/token";
import {
  arrayBufferToBase64,
  utf8ToBase64,
  base64ToArrayBuffer,
  base64ToUtf8,
  encryptAesCbc,
  decryptAesCbc,
  arrayBufferToUtf8,
} from "@/_helpers/crypto";

export function pack(prot: TokenProtected): string {
  const b64Syn = arrayBufferToBase64(prot.SynchronizationBytes);
  const b64Head = utf8ToBase64(JSON.stringify(prot.Header));
  const b64Pld = utf8ToBase64(JSON.stringify(prot.Payload));
  const b64Sign = arrayBufferToBase64(prot.SignatureBytes);

  return [b64Syn, b64Head, b64Pld, b64Sign].join(".");
}

export function unpack(token: string): TokenProtected {
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

export async function protect(
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

export async function unprotect(
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
