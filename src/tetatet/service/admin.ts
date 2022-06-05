import { Axios } from "axios";
import { patchAdmin, patchProtect } from "../patch";
import CryptoService from "./crypto";
import TokenService from "./token";

export default class AdminService {
  private client: Axios;

  public constructor(ts: TokenService, cs: CryptoService, token: string) {
    this.client = patchProtect(
      patchAdmin(new Axios({ baseURL: "http://localhost:8081/api/admin" }), cs),
      ts,
      token
    );
  }

  public async getUsers(): Promise<User[]> {
    const res = await this.client.get("/user");
    return res.data?.users;
  }
}
