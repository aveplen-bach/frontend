import { Axios } from "axios";
import { RegisterRequest } from "../model/register";
import { User } from "../model/user";
import { patchAdmin, patchProtect } from "../patch";
import CryptoService from "./crypto";
import TokenService from "./token";

export default class AdminService {
  private client: Axios;

  public constructor(ts: TokenService, cs: CryptoService) {
    this.client = patchProtect(
      patchAdmin(new Axios({ baseURL: "http://localhost:8081/api/admin" }), cs),
      ts
    );
  }

  public async getUsers(): Promise<User[]> {
    const res = await this.client.get("/user");
    return res.data?.users;
  }

  public async register(req: RegisterRequest): Promise<boolean> {
    const res = await this.client.get("/register");
    return res.status === 200;
  }
}
