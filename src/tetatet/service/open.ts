import { Axios } from "axios";

export default class OpenService {
  private client: Axios;

  public constructor() {
    this.client = new Axios({ baseURL: "http://localhost:8081/api/open" });
  }

  public async authenticated(): Promise<boolean> {
    const res = await this.client.get("/authenticated");
    if (res.status !== 200) {
      throw "server returned bad status code";
    }
    return res.data?.authenticated;
  }
}
