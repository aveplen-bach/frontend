import { Axios } from "axios";
import {
  arrayBufferToBase64,
  base64ToArrayBuffer,
  encryptAesCbc,
  utf8ToArrayBuffer,
} from "@/tetatet/cryptoutil";
import { LoginRequest, LoginResult } from "@/tetatet/model/login";

enum LoginStage {
  CLIENT_CONN_INIT = 1,
  SERVER_GEN_MAC,
  CLIENT_CRIDENTIALS,
  SERVER_TOKEN,
}

export default async function login(
  url: string,
  req: LoginRequest
): Promise<LoginResult> {
  const client = new Axios({
    url: url,
  });

  const key = await deriveSessionKey(
    req.password,
    await getSalt(client, req.username)
  );

  const iv = generateIv();

  const token = await getToken(
    client,
    req.username,
    await encryptAesCbc(await req.photo.arrayBuffer(), key, iv),
    iv
  );

  return {
    key,
    iv,
    token,
  };
}

async function getSalt(client: Axios, username: string): Promise<ArrayBuffer> {
  const res = await client.post("/", {
    stage: LoginStage.CLIENT_CONN_INIT,
    username: username,
  });

  if (res.status !== 200) {
    throw "server returned bas status code";
  }

  if (res.data?.stage !== LoginStage.SERVER_GEN_MAC) {
    throw "server returned message with invalid stage";
  }

  return base64ToArrayBuffer(res.data?.mac);
}

async function deriveSessionKey(
  password: string,
  salt: ArrayBuffer
): Promise<CryptoKey> {
  return await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 4096,
      hash: "SHA-1",
    },
    await getKeyMaterial(password),
    { name: "AES-CBC", length: 128 },
    true,
    ["encrypt", "decrypt"]
  );
}

async function getKeyMaterial(password: string): Promise<CryptoKey> {
  const passwordb = utf8ToArrayBuffer(password);

  return await window.crypto.subtle.importKey(
    "raw",
    passwordb,
    "PBKDF2",
    false,
    ["deriveBits", "deriveKey"]
  );
}

function generateIv(): ArrayBuffer {
  return window.crypto.getRandomValues(new Uint8Array(16)).buffer;
}

async function getToken(
  client: Axios,
  username: string,
  ephoto: ArrayBuffer,
  iv: ArrayBuffer
): Promise<string> {
  const res = await client.post("/", {
    stage: LoginStage.CLIENT_CRIDENTIALS,
    cipher: arrayBufferToBase64(ephoto),
    iv: arrayBufferToBase64(iv),
    username: username,
  });

  if (res.status !== 200) {
    throw "server returned bas status code";
  }

  if (res.data?.stage !== LoginStage.SERVER_TOKEN) {
    throw "server returned message with invalid stage";
  }

  return res.data?.token;
}
