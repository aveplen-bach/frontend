import { Axios } from "axios";
import CryptoService from "./service/crypto";
import TokenService from "./service/token";

export function patchProtect(inst: Axios, ts: TokenService): Axios {
  inst.interceptors.request.use(async (config) => {
    debugger;

    config.headers = config.headers || {};
    if (config.headers && config.headers["Authorization"]) {
      throw "authorization header already set";
    }
    config.headers = {
      Authorization: `Bearer ${ts.getCurrent()}`,
      ...config.headers,
    };
    return config;
  });

  inst.interceptors.response.use(async (config) => {
    debugger;

    if (typeof config.data !== "object") {
      config.data = JSON.parse(config.data);
    }
    const next = config.data?.next;
    if (!ts.validateNext(next)) {
      throw "server not authorized";
    }
    ts.setCurrent(await ts.next(next));
    config.data = config.data?.data;
    return config;
  });

  return inst;
}

export function patchAdmin(inst: Axios, cs: CryptoService): Axios {
  inst.interceptors.request.use(async (config) => {
    debugger;

    if (config.data) {
      config.data = await cs.encrypt(JSON.stringify(config.data));
    }
    return config;
  });

  inst.interceptors.response.use(async (config) => {
    debugger;

    if (typeof config.data === "object") {
      config.data = JSON.parse(await cs.decrypt(config.data));
    } else {
      config.data = JSON.parse(config.data);
      config.data.data = JSON.parse(await cs.decrypt(config.data?.data));
    }
    return config;
  });

  return inst;
}
