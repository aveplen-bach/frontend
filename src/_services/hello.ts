import {
  arrayBufferToBase64,
  base64ToArrayBuffer,
  exportKey,
  importKey,
} from "@/_helpers/crypto";
import { unpack, unprotect } from "@/_helpers/token";
import { Authentication } from "./model/auth";

export const helloService = {
  hello,
};

async function hello(
  helloToken: string,
  helloKey: string,
  helloIv: string
): Promise<Authentication> {
  const key = await importKey(helloKey);
  const iv = base64ToArrayBuffer(helloIv);
  const unpacked = unpack(helloToken);
  const raw = await unprotect(unpacked, key, iv);

  localStorage.setItem(
    "authentication",
    JSON.stringify({
      username: "hello_username",
      token: raw,
      key: await exportKey(key),
      iv: arrayBufferToBase64(iv),
    })
  );

  return {
    username: "hello_username",
    token: raw,
    key: key,
    iv: iv,
  };
}
