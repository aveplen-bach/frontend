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

  authp.raw.Syn.syn += authp.raw.Syn.inc;
  authp.raw.Syn.inc = Math.random() % 1000;

  const protectedd = await protect(authp.raw, auth.key, auth.iv);
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

  if (unprotected.Syn.syn !== authp.raw.Syn.syn + authp.raw.Syn.inc) {
    throw "server returned incorrect syn";
  }

  authp.raw.Syn = unprotected.Syn;

  response.data = JSON.parse(
    arrayBufferToUtf8(
      await decryptAesCbc(
        base64ToArrayBuffer(response.data?.data),
        auth.key,
        auth.iv
      )
    )
  );

  return response;
};
