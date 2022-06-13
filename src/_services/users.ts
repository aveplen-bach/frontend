import { config } from "@/_config";
import { arrayBufferToBase64, encryptAesCbc } from "@/_helpers/crypto";
import { parseAuthentication } from "@/_helpers/ls-to-auth";
import axios from "axios";
import { RegisterRequest } from "./model/register";
import { User } from "./model/user";

export const adminService = {
  getUsers,
  register,
};

async function getUsers(): Promise<User[]> {
  try {
    const res = await axios.get(`${config.baseUrl}/auth/encr/user`);
    return res.data?.users;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function register(req: RegisterRequest): Promise<void> {
  if (!/^[a-zA-Z_0-9]{3,}$/.test(req.username)) {
    throw "недопустимое имя пользователя";
  }

  if (!/^[a-zA-Z_0-9]{3,}$/.test(req.password)) {
    throw "недопустимый пароль";
  }

  if (req.password !== req.repeat) {
    throw "парли должны совпадать";
  }

  try {
    await axios.post(`${config.baseUrl}/auth/encr/register`, {
      username: req.username,
      password: req.password,
      admin: req.admin,
      photo: arrayBufferToBase64(req.photo),
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
}
