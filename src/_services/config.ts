import { config } from "@/_config";
import axios from "axios";
import { UpdateFacerecConfigRequest } from "./model/config";

export const configService = {
  updateFacerecConfig,
};

async function updateFacerecConfig(
  req: UpdateFacerecConfigRequest
): Promise<void> {
  if (!/0\.0+[1-9][0-9]*/.test(req.distanceStr)) {
    throw "необходимо число меньше единицы";
  }

  try {
    await axios.post(`${config.baseUrl}/config/encr/facerec`, {
      distance: parseFloat(req.distanceStr),
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}
