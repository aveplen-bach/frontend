import { Axios } from "axios";
import { patchProtect } from "../patch";
import TokenService from "./token";

export default class ProtectedService {
  private client: Axios;

  public constructor(ts: TokenService) {
    this.client = patchProtect(
      new Axios({ baseURL: "http://192.168.10.101:8081/api/protected" }),
      ts
    );
  }

  public async authenticated(): Promise<boolean> {
    const res = await this.client.post("/authenticated");
    if (res.status !== 200) {
      console.error(res.data?.err);
      throw "server returned bad status code";
    }
    return res.data?.authenticated;
  }

  public async logout(): Promise<void> {
    const res = await this.client.post("/logout");
    if (res.status !== 200) {
      console.error(res.data?.err);
      throw "server returned bad status code";
    }
  }
}
