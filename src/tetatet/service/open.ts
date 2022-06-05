import { Axios } from "axios";

export default class OpenService {
  private client: Axios;

  public constructor() {
    this.client = new Axios({ baseURL: "http://localhost:8081/api/open" });
  }

  public async about() {
    const res = await this.client.get("/about");
    if (res.status != 200) {
      throw "server returned bad status code";
    }
  }
}
