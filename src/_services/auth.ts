import {
  arrayBufferToBase64,
  base64ToArrayBuffer,
  encryptAesCbc,
  exportKey,
  pbkdf2,
  randomIv,
} from "../_helpers/crypto";
import { config } from "@/_config";
import { unpack, unprotect } from "@/_helpers/token";
import axios from "axios";
import { Authentication } from "./model/auth";

export const authService = {
  login,
  logout,
};

enum LoginStage {
  CLIENT_CONN_INIT = 1,
  SERVER_GEN_MAC,
  CLIENT_CRIDENTIALS,
  SERVER_TOKEN,
}

async function login(
  username: string,
  password: string,
  photo: Blob
): Promise<Authentication> {
  const getSaltRes = await axios.post(`${config.baseUrl}/open/login`, {
    stage: LoginStage.CLIENT_CONN_INIT,
    username: username,
  });

  if (getSaltRes.status !== 200) {
    console.error(getSaltRes.data?.err);
    throw "server returned bas status code";
  }

  const salt = getSaltRes.data?.loginMac;

  const key = await pbkdf2(password, base64ToArrayBuffer(salt));
  const iv = randomIv();
  const encrypted = await encryptAesCbc(await photo.arrayBuffer(), key, iv);

  const getTokenRes = await axios.post(`${config.baseUrl}/open/login`, {
    stage: LoginStage.CLIENT_CRIDENTIALS,
    username: username,
    cipher: arrayBufferToBase64(encrypted),
    iv: arrayBufferToBase64(iv),
  });

  const token = getTokenRes.data?.token;
  const unpacked = unpack(token);
  const raw = await unprotect(unpacked, key, iv);

  localStorage.setItem(
    "authentication",
    JSON.stringify({
      username: username,
      token: raw,
      key: await exportKey(key),
      iv: arrayBufferToBase64(iv),
    })
  );

  return {
    username: username,
    raw: raw,
    key: key,
    iv: iv,
  };
}

async function logout() {
  const res = await axios.get(`${config.baseUrl}/prot/logout`);
  if (res.status !== 200) {
    console.error(res.data?.err);
    throw "server returned bas status code";
  }

  localStorage.removeItem("authentication");
}
