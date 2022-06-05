export const b64EncodeString = (unpacked: ArrayBuffer) => {
  // eslint-disable-next-line
  // @ts-ignore
  // return btoa(String.fromCharCode.apply(null, new Uint8Array(unpacked)));
  return btoa(String.fromCharCode.apply(null, unpacked));
};

export const b64DecodeString = (packed: string) => {
  const string = atob(packed);
  const buffer = new ArrayBuffer(string.length);
  const bufferView = new Uint8Array(buffer);

  for (let i = 0; i < string.length; i++) {
    bufferView[i] = string.charCodeAt(i);
  }

  return buffer;
};
