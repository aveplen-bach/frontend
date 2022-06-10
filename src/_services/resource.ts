import { config } from "@/_config";
import axios from "axios";

export const resourceService = {
  access,
};

async function access(): Promise<boolean> {
  try {
    const res = await axios.post(`${config.baseUrl}/protected/authenticated`);
    return res.data?.authenticated;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
