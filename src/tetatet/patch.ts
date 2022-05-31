import { Axios } from "axios"

export const patch = (inst: Axios, key: CryptoKey) => {
    inst.interceptors.request.use(async (config) => {
        // const encoded = encode(JSON.stringify(config.data));
        // const encrypted = await encrypt(encoded, key);
        // config.data = pack(encrypted);
    }, (error) => {
        alert(error);
    })
    return inst;
}
