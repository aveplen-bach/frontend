import { config } from "@/_config";
import axios from "axios";
import { User } from "./model/user";

export const adminService = {
  getUsers,
};

async function getUsers(): Promise<User[]> {
  const res = await axios.post(`${config.baseUrl}/admin/user`, {});
  if (res.status !== 200) {
    console.error(res.data?.err);
    throw "server returned bas status code";
  }

  return res.data?.users;
}
