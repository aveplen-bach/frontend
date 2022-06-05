export async function encryptAesCbc(
  data: ArrayBuffer,
  key: CryptoKey,
  iv: ArrayBuffer
): Promise<ArrayBuffer> {
  const cipher = await window.crypto.subtle.encrypt(
    {
      name: "AES-CBC",
      iv,
    },
    key,
    data
  );

  return cipher;
}

export async function decryptAesCbc(
  data: ArrayBuffer,
  key: CryptoKey,
  iv: ArrayBuffer
): Promise<ArrayBuffer> {
  const cipher = await window.crypto.subtle.decrypt(
    {
      name: "AES-CBC",
      iv,
    },
    key,
    data
  );

  return cipher;
}

export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary_string = window.atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export function utf8ToBase64(utf8: string): string {
  return btoa(utf8);
}

export function base64ToUtf8(base64: string): string {
  return atob(base64);
}

export function utf8ToArrayBuffer(utf8: string): ArrayBuffer {
  return base64ToArrayBuffer(utf8ToBase64(utf8));
}

export function arrayBufferToUtf8(buffer: ArrayBuffer): string {
  return base64ToUtf8(arrayBufferToBase64(buffer));
}
