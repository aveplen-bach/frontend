import { Axios } from "axios";
import { patchProtect } from "../patch";
import TokenService from "./token";

export default class ProtectedService {
  private client: Axios;

  public constructor(ts: TokenService) {
    this.client = patchProtect(
      new Axios({ baseURL: "http://localhost:8081/api/protected" }),
      ts
    );
  }

  public async isAuthenticated(): Promise<boolean> {
    debugger;
    const res = await this.client.get("/authenticated");
    debugger;
    return res.data?.authenticated;
  }
}