import { LSAuthentication } from "@/_services/model/auth";
import { Axios, AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
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
  config.url = config.url || "";

  const prot = config.url.includes("/prot");
  const encr = config.url.includes("/encr");

  if (!(encr || prot)) {
    return config;
  }

  const authJson = localStorage.getItem("authentication");
  if (!authJson) {
    const err = `local storage does not contain "authentication" key`;
    console.error(err);
    throw err;
  }
  localStorage.setItem("fallback", authJson);

  const authObj: LSAuthentication = JSON.parse(authJson);
  const { key, iv } = await parseAuthentication(authObj);

  authObj.token.Syn.syn += authObj.token.Syn.inc;
  authObj.token.Syn.inc = Math.floor(Math.random() * 1000);

  const packed = pack(await protect(authObj.token, key, iv));

  config.headers = config.headers || {};
  config.headers = {
    ...config.headers,
    Authorization: `Bearer ${packed}`,
  };

  if (encr && config.data) {
    config.data = arrayBufferToBase64(
      await encryptAesCbc(
        utf8ToArrayBuffer(JSON.stringify(config.data)),
        key,
        iv
      )
    );
  }

  localStorage.setItem("authentication", JSON.stringify(authObj));
  return config;
};

export const patchResponse200 = async (response: AxiosResponse) => {
  response.config = response.config || {};

  if (!response.config.url) {
    const err = "no url in response config";
    console.error(err);
    throw err;
  }

  const prot = response.config.url.includes("/prot");
  const encr = response.config.url.includes("/encr");

  if (!(encr || prot)) {
    return response;
  }

  const authJson = localStorage.getItem("authentication");
  if (!authJson) {
    const err = `local storage does not contain "authentication" key`;
    console.error(err);
    throw err;
  }

  const authObj: LSAuthentication = JSON.parse(authJson);
  const { key, iv } = await parseAuthentication(authObj);

  const next = response.data?.next;
  console.log(next);
  if (!next) {
    const err = "server did not return new token";
    console.error(err);
    fallback(err);
    throw err;
  }

  const unpacked = unpack(next);
  const unprotected = await unprotect(unpacked, key, iv);

  if (unprotected.Syn.syn !== authObj.token.Syn.syn + authObj.token.Syn.inc) {
    const err = "server returned incorrect syn";
    fallback(err);
    throw err;
  }

  authObj.token.Syn = unprotected.Syn;

  if (prot) {
    response.data = response.data?.data;
  }

  if (encr) {
    response.data = JSON.parse(
      arrayBufferToUtf8(
        await decryptAesCbc(base64ToArrayBuffer(response.data?.data), key, iv)
      )
    );
  }

  localStorage.setItem("authentication", JSON.stringify(authObj));
  return response;
};

export const patchResponse400 = async (error: AxiosError) => {
  if (error.response?.status === 404) {
    const err = "server returned 404";
    console.error(err);
    throw error;
  }

  if (!error.config.url) {
    const err = "no url in error response config";
    console.error(err);
    throw err;
  }

  const prot = error.config.url.includes("/prot");
  const encr = error.config.url.includes("/encr");

  if (!(encr || prot)) {
    const err = "nothing to do with response";
    fallback(err);
    throw `${err}: ${error}`;
  }

  const authJson = localStorage.getItem("authentication");
  if (!authJson) {
    const err = `local storage does not contain "authentication" key`;
    console.error(err);
    throw `${err}: ${error}`;
  }

  const authObj: LSAuthentication = JSON.parse(authJson);
  const { key, iv } = await parseAuthentication(authObj);

  const next = (error.response?.data as { next: string }).next;
  if (!next) {
    const err = "server did not return new token";
    console.error(err);
    fallback(err);
    throw `${err}: ${error}`;
  }

  const unpacked = unpack(next);
  const unprotected = await unprotect(unpacked, key, iv);

  if (unprotected.Syn.syn !== authObj.token.Syn.syn + authObj.token.Syn.inc) {
    const err = "server returned incorrect syn";
    fallback(err);
    throw `${err}: ${error}`;
  }

  authObj.token.Syn = unprotected.Syn;

  if (prot && error.response) {
    error.response.data = (
      error.response.data as { data: string | object }
    ).data;
  }

  if (encr && error.response) {
    error.response.data = JSON.parse(
      arrayBufferToUtf8(
        await decryptAesCbc(
          base64ToArrayBuffer((error.response.data as { data: string }).data),
          key,
          iv
        )
      )
    );
  }

  if ((error.response?.data as { err: string }).err.includes("syn")) {
    const err = "server did not accept token";
    fallback(err);
    throw err;
  }

  localStorage.setItem("authentication", JSON.stringify(authObj));
  throw (error.response?.data as { err: string }).err;
};

function fallback(cause: string | null) {
  const fb = localStorage.getItem("fallback");
  if (!fb) {
    const err = `local storage does not contain "fallback" key`;
    console.error(err);
    throw err;
  }

  localStorage.setItem("authentication", fb);
}
