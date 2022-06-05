import axios from "axios";
import { b64EncodeString, b64DecodeString } from "@/tetatet/pack";

enum LoginStage {
  CLIENT_CONN_INIT = 1,
  SERVER_GEN_MAC,
  CLIENT_CRIDENTIALS,
  SERVER_TOKEN,
}

interface LoginRequest {
  username: string;
  password: string;
  photo: Blob;
}

export const login = async (url: string, req: LoginRequest) => {
  const { salt, sessionId } = await getSalt(url, req.username);
  const key = await deriveSessionKey(req.password, salt);
  const { cipher, iv } = await encrypt(req.photo, key);

  const token = await getToken(url, sessionId, cipher, iv, req.username);
  alert(token);

  return {
    token,
    key,
    iv,
  };
};

const getSalt = async (url: string, username: string) => {
  const res = await axios.post(url, {
    stage: LoginStage.CLIENT_CONN_INIT,
    username: username,
  });

  if (res.status !== 200) {
    throw "server returned bas status code";
  }

  if (res.data?.stage !== LoginStage.SERVER_GEN_MAC) {
    throw "server returned message with invalid stage";
  }

  return {
    salt: b64DecodeString(res.data?.mac),
    sessionId: res.data?.sessionId,
  };
};

const getToken = async (
  url: string,
  sessionId: string,
  cipher: string,
  iv: string,
  username: string
) => {
  const res = await axios.post(url, {
    sessionId: sessionId,
    stage: LoginStage.CLIENT_CRIDENTIALS,
    cipher: cipher,
    iv: iv,
    username: username,
  });

  if (res.status !== 200) {
    throw "server returned bas status code";
  }

  if (res.data?.stage !== LoginStage.SERVER_TOKEN) {
    throw "server returned message with invalid stage";
  }

  return res.data?.token;
};

const deriveSessionKey = async (password: string, salt: ArrayBuffer) =>
  await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 4096,
      hash: "SHA-1",
    },
    await getKeyMaterial(getPasswordBytes(password)),
    { name: "AES-CBC", length: 128 },
    true,
    ["encrypt", "decrypt"]
  );

const getPasswordBytes = (password: string) => {
  const enc = new TextEncoder();
  return enc.encode(password);
};

const getKeyMaterial = async (passwordBytes: Uint8Array) =>
  window.crypto.subtle.importKey("raw", passwordBytes, "PBKDF2", false, [
    "deriveBits",
    "deriveKey",
  ]);

const toArrayLike = async (blob: Blob) => {
  return await new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => {
      resolve(fr.result);
    };
    fr.onerror = reject;
    fr.readAsArrayBuffer(blob);
  });
};

// const generateIv = (bdata: Uint8Array) => bdata.slice(0, 16);
const generateIv = () => window.crypto.getRandomValues(new Uint8Array(16));

const encrypt = async (data: any, key: CryptoKey) => {
  // const encoded = encode(data);
  const arrayLike = await toArrayLike(data);
  // eslint-disable-next-line
  // @ts-ignore
  const iv = generateIv(arrayLike);
  const cipher = await window.crypto.subtle.encrypt(
    {
      name: "AES-CBC",
      iv,
    },
    key,
    // eslint-disable-next-line
    // @ts-ignore
    arrayLike
  );

  return {
    cipher: b64EncodeString(cipher),
    iv: b64EncodeString(iv),
  };
};
