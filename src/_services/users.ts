import { config } from "@/_config";
import { arrayBufferToBase64 } from "@/_helpers/crypto";
import axios from "axios";
import { RegisterRequest } from "./model/register";
import { User } from "./model/user";

export const adminService = {
  getUsers,
  register,
};

async function getUsers(): Promise<User[]> {
  try {
    const res = await axios.get(`${config.authBaseUrl}/auth/encr/users`);
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

  if (req.photo.byteLength === 0) {
    throw "выбранный файл пуст";
  }

  try {
    debugger;
    await axios.post(`${config.authBaseUrl}/auth/encr/users`, {
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
