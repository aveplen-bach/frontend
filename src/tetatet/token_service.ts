import { decryptAesCbc, encryptAesCbc } from "./cryptoutil";

export default class TokenService {
  private key: CryptoKey;
  private iv: ArrayBuffer;

  constructor(key: CryptoKey, iv: ArrayBuffer) {
    this.key = key;
    this.iv = iv;
  }

  public async NextToken(token: string): Promise<string> {
    const prot = unpack(token);
    const raw = await unprotect(prot, this.key, this.iv);

    raw.Synchronization.syn += raw.Synchronization.inc;

    const reprot = await protect(raw, this.key, this.iv);
    const repacked = pack(reprot);

    return repacked;
  }
}

function pack(prot: TokenProtected): string {
  const b64Syn = _arrayBufferToBase64(prot.SynchronizationBytes);
  const b64Head = btoa(JSON.stringify(prot.Header));
  const b64Pld = btoa(JSON.stringify(prot.Payload));
  const b64Sign = _arrayBufferToBase64(prot.SignatureBytes);

  return [b64Syn, b64Head, b64Pld, b64Sign].join(".");
}

function _base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary_string = window.atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

function _arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

function unpack(token: string): TokenProtected {
  const tokenParts = token.split(".");
  if (tokenParts.length != 4) {
    throw "token is damaged or of wrong format";
  }

  const syn = _base64ToArrayBuffer(tokenParts[0]);
  const head = JSON.parse(atob(tokenParts[1]));
  const plb: Payload = JSON.parse(atob(tokenParts[2]));
  const sign = _base64ToArrayBuffer(tokenParts[3]);

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
  const synb = btoa(JSON.stringify(raw.Synchronization));
  const encsyn = await encryptAesCbc(_base64ToArrayBuffer(synb), key, iv);

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

  const syn = atob(_arrayBufferToBase64(synb));

  return {
    Synchronization: JSON.parse(syn),
    Header: prot.Header,
    Payload: prot.Payload,
    SignatureBytes: prot.SignatureBytes,
  };
}
