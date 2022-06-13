import { config } from "@/_config";
import axios from "axios";
import { UpdateFacerecConfigRequest } from "./model/config";

export const configService = {
  updateFacerecConfig,
};

async function updateFacerecConfig(
  req: UpdateFacerecConfigRequest
): Promise<void> {
  try {
    await axios.post(`${config.baseUrl}/config/encr/facerec`, {
      distance: parseFloat(req.distanceStr),
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}
