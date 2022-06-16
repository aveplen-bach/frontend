import { config } from "@/_config";
import axios from "axios";

export const resourceService = {
  access,
};

async function access(): Promise<boolean> {
  debugger;

  try {
    const res = await axios.get(
      `${config.resourceBaseUrl}/resource/prot/authenticated`
    );
    return JSON.parse(res.data?.authenticated);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
