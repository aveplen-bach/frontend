import { Axios } from "axios";
import { arrayBufferToBase64 } from "../cryptoutil";
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
    const res = await this.client.post("/user");
    return res.data?.users;
  }

  public async register(req: RegisterRequest): Promise<void> {
    const res = await this.client.post("/register", {
      ...req,
      photo: arrayBufferToBase64(req.photo),
    });

    if (res.status !== 200) {
      console.error(res.data?.err);
      throw res.data?.err;
    }
  }
}
