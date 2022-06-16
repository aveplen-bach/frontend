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
  const b64Syn = arrayBufferToBase64(prot.SynBytes);
  const b64Head = utf8ToBase64(JSON.stringify(prot.Header));
  const b64Pld = utf8ToBase64(JSON.stringify(prot.Pld));
  const b64Sign = prot.Sign;

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
  const sign = tokenParts[3];

  return {
    SynBytes: syn,
    Header: head,
    Pld: plb,
    Sign: sign,
  };
}

export async function protect(
  raw: TokenRaw,
  key: CryptoKey,
  iv: ArrayBuffer
): Promise<TokenProtected> {
  const synb = utf8ToBase64(JSON.stringify(raw.Syn));
  const encsyn = await encryptAesCbc(base64ToArrayBuffer(synb), key, iv);

  return {
    SynBytes: encsyn,
    Header: raw.Header,
    Pld: raw.Pld,
    Sign: raw.Sign,
  };
}

export async function unprotect(
  prot: TokenProtected,
  key: CryptoKey,
  iv: ArrayBuffer
): Promise<TokenRaw> {
  const synb = await decryptAesCbc(prot.SynBytes, key, iv);

  return {
    Syn: JSON.parse(arrayBufferToUtf8(synb)),
    Header: prot.Header,
    Pld: prot.Pld,
    Sign: prot.Sign,
  };
}
