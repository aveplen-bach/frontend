<template>
  <form>
    <div class="form-group">
      <label for="exampleInputEmail1">Email address</label>
      <input
        type="username"
        class="form-control"
        id="username-form-field"
        aria-describedby="username-help"
        placeholder="Enter username"
        v-model="username"
      />
      <small id="username-help" class="form-text text-muted"
        >Please, enter unique username.</small
      >
    </div>

    <div class="form-group">
      <label for="exampleInputPassword1">Password</label>
      <input
        type="password"
        class="form-control"
        id="exampleInputPassword1"
        placeholder="Password"
        v-model="password"
      />
    </div>

    <div class="form-group">
      <label for="exampleFormControlFile1">Example file input</label>
      <input
        type="file"
        class="form-control-file"
        id="exampleFormControlFile1"
        ref="file"
      />
    </div>
    <button type="submit" class="btn btn-primary">Submit</button>
  </form>
</template>

<script lang="ts" setup>
import { Ref, ref } from "@vue/reactivity";
import axios from "axios";

const username = ref("");
const password = ref("");
const file: Ref<null | FileList> = ref(null);

// Лёха, перенеси меня в либу, пожалуйста

const getPasswordBytes = () => {
  let enc = new TextEncoder();
  return enc.encode(password.value);
};

const getKeyMaterial = async () => {
  return window.crypto.subtle.importKey(
    "raw",
    getPasswordBytes(),
    "PBKDF2",
    false,
    ["deriveBits", "deriveKey"]
  );
};

const deriveSessionKey = async (salt: Uint8Array) => {
  const sessionKey = await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 1000,
      hash: "SHA-256",
    },
    await getKeyMaterial(),
    { name: "AES-CBC", length: 128 },
    true,
    ["encrypt", "decrypt"]
  );
};

const generateKey = async () =>
  window.crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );

const encode = (data: any) => {
  const encoder = new TextEncoder();

  return encoder.encode(data);
};

const generateIv = (bdata: Uint8Array) => bdata.slice(0, 12);

const encrypt = async (data: any, key: CryptoKey) => {
  const encoded = encode(data);
  const iv = generateIv(encoded);
  const cipher = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    encoded
  );

  return {
    cipher,
    iv,
  };
};

const pack = (buffer: any) => {
  let str = "";
  new Uint8Array(buffer).forEach((byte) => {
    str += String.fromCharCode(byte);
  });

  return btoa(str);
};

const unpack = (packed: any) => {
  const string = window.atob(packed);
  const buffer = new ArrayBuffer(string.length);
  const bufferView = new Uint8Array(buffer);

  for (let i = 0; i < string.length; i++) {
    bufferView[i] = string.charCodeAt(i);
  }

  return buffer;
};
// Лёха, перенеси меня в либу, пожалуйста

const register = async () => {
  let photo: File | null = null;
  if (file.value !== null) {
    photo = file.value.item(0);
  }

  const request = {
    username,
    password,
    photo,
  };

  await axios.post("http://192.168.10.105:8081", {});
};
</script>

<style></style>
