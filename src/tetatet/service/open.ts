import { Axios } from "axios";

export default class OpenService {
  private client: Axios;

  public constructor() {
    this.client = new Axios({ baseURL: "http://192.168.10.101:8081/api/open" });
  }

  public async authenticated(): Promise<boolean> {
    const res = await this.client.post("/authenticated");
    if (res.status !== 200) {
      console.error(res.data?.err);
      throw "server returned bad status code";
    }
    return res.data?.authenticated;
  }
}
