import { LSAuthentication } from "@/_services/model/auth";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  base64ToArrayBuffer,
  arrayBufferToBase64,
  encryptAesCbc,
  utf8ToArrayBuffer,
  arrayBufferToUtf8,
  decryptAesCbc,
} from "./crypto";
import { parseAuthentication } from "./ls-to-auth";
import { protect, pack, unpack, unprotect } from "./token";

export const patchRequest = async (config: AxiosRequestConfig) => {
  console.log(config);
  debugger;

  config.url = config.url || "";

  const prot = config.url.indexOf("/prot") > 0;
  const encr = config.url.indexOf("/encr") > 0;

  if (!(encr || prot)) {
    return config;
  }

  const authentication = localStorage.getItem("authentication");
  if (!authentication) {
    throw "not authenticated";
  }

  const authp: LSAuthentication = JSON.parse(authentication);
  const auth = await parseAuthentication(authp);

  authp.token.Syn.syn += authp.token.Syn.inc;
  authp.token.Syn.inc = Math.floor(Math.random() * 1000);

  localStorage.setItem(
    "authentication",
    JSON.stringify({
      username: authp.username,
      token: authp.token,
      key: authp.key,
      iv: authp.iv,
    })
  );

  const protectedd = await protect(authp.token, auth.key, auth.iv);
  const packed = pack(protectedd);

  config.headers = config.headers || {};
  config.headers = {
    ...config.headers,
    Authorization: `Bearer ${packed}`,
  };

  if (encr && config.data) {
    config.data = arrayBufferToBase64(
      await encryptAesCbc(
        utf8ToArrayBuffer(JSON.stringify(config.data)),
        auth.key,
        auth.iv
      )
    );
  }

  return config;
};

export const patchResponse = async (response: AxiosResponse) => {
  console.log(response);

  debugger;

  response.config = response.config || {};

  if (!response.config.url) {
    console.error("no url in response config");
    throw "no url in response config";
  }

  const prot = response.config.url.indexOf("/prot") > 0;
  const encr = response.config.url.indexOf("/encr") > 0;

  if (!(encr || prot)) {
    return response;
  }

  const authentication = localStorage.getItem("authentication");
  if (!authentication) {
    throw "not authenticated";
  }

  const authp: LSAuthentication = JSON.parse(authentication);
  const auth = await parseAuthentication(authp);

  const next = response.data?.next;
  if (!next) {
    throw "server did not return new token";
  }

  const unpacked = unpack(next);
  const unprotected = await unprotect(unpacked, auth.key, auth.iv);

  if (unprotected.Syn.syn !== authp.token.Syn.syn + authp.token.Syn.inc) {
    throw "server returned incorrect syn";
  }

  authp.token.Syn = unprotected.Syn;

  localStorage.setItem(
    "authentication",
    JSON.stringify({
      username: authp.username,
      token: authp.token,
      key: authp.key,
      iv: authp.iv,
    })
  );

  if (prot) {
    response.data = response.data?.data;
  }

  if (encr) {
    response.data = JSON.parse(
      arrayBufferToUtf8(
        await decryptAesCbc(
          base64ToArrayBuffer(response.data?.data),
          auth.key,
          auth.iv
        )
      )
    );
  }

  return response;
};
