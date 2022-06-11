import {
  arrayBufferToBase64,
  arrayBufferToUtf8,
  base64ToArrayBuffer,
  base64ToUtf8,
  decryptAesCbc,
  encryptAesCbc,
  utf8ToBase64,
} from "@/_helpers/crypto";
import { TokenProtected, TokenRaw } from "@/_services/model/token";

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

    raw.Syn.syn += raw.Syn.inc;

    const reprot = await protect(raw, this.key, this.iv);
    const repacked = pack(reprot);

    return repacked;
  }

  public async validateNext(next: string): Promise<boolean> {
    const prevRaw = await unprotect(unpack(this.current), this.key, this.iv);
    const nextRaw = await unprotect(unpack(next), this.key, this.iv);

    return prevRaw.Syn.syn + prevRaw.Syn.inc == nextRaw.Syn.syn;
  }
}

function pack(prot: TokenProtected): string {
  const b64Syn = arrayBufferToBase64(prot.SynBytes);
  const b64Head = utf8ToBase64(JSON.stringify(prot.Header));
  const b64Pld = utf8ToBase64(JSON.stringify(prot.Pld));
  const b64Sign = arrayBufferToBase64(prot.SignBytes);

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
    SynBytes: syn,
    Header: head,
    Pld: plb,
    SignBytes: sign,
  };
}

async function protect(
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
    SignBytes: raw.SignBytes,
  };
}

async function unprotect(
  prot: TokenProtected,
  key: CryptoKey,
  iv: ArrayBuffer
): Promise<TokenRaw> {
  const synb = await decryptAesCbc(prot.SynBytes, key, iv);

  return {
    Syn: JSON.parse(arrayBufferToUtf8(synb)),
    Header: prot.Header,
    Pld: prot.Pld,
    SignBytes: prot.SignBytes,
  };
}
