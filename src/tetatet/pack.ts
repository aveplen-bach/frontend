export const pack = (unpacked: any) => {
    // eslint-disable-next-line
    // @ts-ignore
    return btoa(String.fromCharCode.apply(null, new Uint8Array(unpacked)))
};

export const unpack = (packed: any) => {
    debugger
    const string = atob(packed);
    const buffer = new ArrayBuffer(string.length);
    const bufferView = new Uint8Array(buffer);

    for (let i = 0; i < string.length; i++) {
        bufferView[i] = string.charCodeAt(i);
    }

    return buffer;
};