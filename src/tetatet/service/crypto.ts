import {
  arrayBufferToBase64,
  arrayBufferToUtf8,
  base64ToArrayBuffer,
  decryptAesCbc,
  encryptAesCbc,
  utf8ToArrayBuffer,
} from "../cryptoutil";

export default class CryptoService {
  private key: CryptoKey;
  private iv: ArrayBuffer;

  constructor(key: CryptoKey, iv: ArrayBuffer) {
    this.key = key;
    this.iv = iv;
  }

  public async encrypt(utf8: string): Promise<string> {
    return arrayBufferToBase64(
      await encryptAesCbc(utf8ToArrayBuffer(utf8), this.key, this.iv)
    );
  }

  public async decrypt(base64: string): Promise<string> {
    return arrayBufferToUtf8(
      await decryptAesCbc(base64ToArrayBuffer(base64), this.key, this.iv)
    );
  }
}
