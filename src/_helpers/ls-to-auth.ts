import { Authentication, LSAuthentication } from "@/_services/model/auth";
import { base64ToArrayBuffer, importKey } from "./crypto";

export async function parseAuthentication(
  ls: LSAuthentication
): Promise<Authentication> {
  return {
    username: ls.username,
    raw: ls.raw,
    key: await importKey(ls.key),
    iv: base64ToArrayBuffer(ls.iv),
  };
}
